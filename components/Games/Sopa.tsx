import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Palabras a buscar
const WORDS = ['GATO', 'PERRO', 'RANA', 'OSO', 'LEON'];
const GRID_SIZE = 10;
const TIME_LIMIT = 180000; // 3 minutos en ms

type Position = { word: string; row: number; col: number; idx: number };

function placeWordsInGrid(
  words: string[],
  gridSize: number
): { grid: string[][]; positions: Position[] } {
  const alphabet = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';

  for (let attempt = 0; attempt < 50; attempt++) {
    const grid: (string | null)[][] = Array(gridSize)
      .fill(null)
      .map(() => Array(gridSize).fill(null));
    const positions: Position[] = [];
    let allPlaced = true;

    for (let idx = 0; idx < words.length; idx++) {
      const word = words[idx];
      let placed = false;
      let tries = 0;

      while (!placed && tries < 100) {
        tries++;
        const direction = Math.floor(Math.random() * 3); // 0: horizontal, 1: vertical, 2: diagonal
        let row: number, col: number;

        if (direction === 0) { // horizontal
          row = Math.floor(Math.random() * gridSize);
          col = Math.floor(Math.random() * (gridSize - word.length + 1));
          let canPlace = true;
          for (let i = 0; i < word.length; i++) {
            const cell = grid[row][col + i];
            if (cell !== null && cell !== word[i]) {
              canPlace = false;
              break;
            }
          }
          if (canPlace) {
            for (let i = 0; i < word.length; i++) {
              grid[row][col + i] = word[i];
              positions.push({ word, row, col: col + i, idx: i });
            }
            placed = true;
          }
        } else if (direction === 1) { // vertical
          row = Math.floor(Math.random() * (gridSize - word.length + 1));
          col = Math.floor(Math.random() * gridSize);
          let canPlace = true;
          for (let i = 0; i < word.length; i++) {
            const cell = grid[row + i][col];
            if (cell !== null && cell !== word[i]) {
              canPlace = false;
              break;
            }
          }
          if (canPlace) {
            for (let i = 0; i < word.length; i++) {
              grid[row + i][col] = word[i];
              positions.push({ word, row: row + i, col, idx: i });
            }
            placed = true;
          }
        } else { // diagonal
          row = Math.floor(Math.random() * (gridSize - word.length + 1));
          col = Math.floor(Math.random() * (gridSize - word.length + 1));
          let canPlace = true;
          for (let i = 0; i < word.length; i++) {
            const cell = grid[row + i][col + i];
            if (cell !== null && cell !== word[i]) {
              canPlace = false;
              break;
            }
          }
          if (canPlace) {
            for (let i = 0; i < word.length; i++) {
              grid[row + i][col + i] = word[i];
              positions.push({ word, row: row + i, col: col + i, idx: i });
            }
            placed = true;
          }
        }
      }

      if (!placed) {
        allPlaced = false;
        break;
      }
    }

    if (allPlaced) {
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          if (grid[r][c] === null) {
            grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
          }
        }
      }
      // @ts-ignore
      return { grid: grid as string[][], positions };
    }
  }

  // Si no se pudo, retorna un tablero vacío
  const emptyGrid: string[][] = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(' '));
  return { grid: emptyGrid, positions: [] };
}

const Sopa = forwardRef((props: any, ref) => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [selected, setSelected] = useState<{ row: number; col: number }[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(TIME_LIMIT);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useImperativeHandle(ref, () => ({
    restart: () => restartGame(),
    forceGameOver: () => handleGameOver(),
    getScore: () => score,
  }));

  // Notifica el score al padre solo cuando cambia el score
  useEffect(() => {
    if (props.onScoreChange) props.onScoreChange(score);
  }, [score]);

  // Inicializa el tablero y el timer
  const setupGame = () => {
    const { grid, positions } = placeWordsInGrid(WORDS, GRID_SIZE);
    setGrid(grid);
    setPositions(positions);
    setSelected([]);
    setFoundWords([]);
    setCurrentWord('');
    setScore(0);
    setTimeLeft(TIME_LIMIT);
    // No llames a props.onScoreChange aquí
  };

  // Timer interno solo para Sopa
  useEffect(() => {
    if (props.isGameOver || props.isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleGameOver();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [props.isGameOver, props.isPaused]);

  useEffect(() => {
    setupGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Selección de letras en línea recta y sin repetir celdas
  const handleCellPress = (row: number, col: number) => {
    if (props.isGameOver || props.isPaused) return;
    if (foundWords.length === WORDS.length) return;

    // No permitir seleccionar la misma celda dos veces
    if (selected.some(cell => cell.row === row && cell.col === col)) return;

    let newSelected = [...selected, { row, col }];

    // Solo permite selección en línea recta
    if (newSelected.length > 1) {
      const dr = newSelected[1].row - newSelected[0].row;
      const dc = newSelected[1].col - newSelected[0].col;
      for (let i = 2; i < newSelected.length; i++) {
        if (
          newSelected[i].row - newSelected[i - 1].row !== dr ||
          newSelected[i].col - newSelected[i - 1].col !== dc
        ) {
          setSelected([]);
          setCurrentWord('');
          return;
        }
      }
    }

    const word = getWordFromSelection(newSelected, grid);

    if (WORDS.includes(word) && !foundWords.includes(word)) {
      setFoundWords([...foundWords, word]);
      setScore((prev) => prev + 1);
      setSelected([]);
      setCurrentWord('');
      if (foundWords.length + 1 === WORDS.length) {
        setTimeout(() => {
          if (props.onGameOver) props.onGameOver();
        }, 500);
      }
    } else if (word.length > 0 && !WORDS.some(w => w.startsWith(word))) {
      setSelected([]);
      setCurrentWord('');
    } else {
      setSelected(newSelected);
      setCurrentWord(word);
    }
  };

  function getWordFromSelection(
    selection: { row: number; col: number }[],
    grid: string[][]
  ): string {
    if (selection.length === 0) return '';
    const dr = selection.length > 1 ? selection[1].row - selection[0].row : 0;
    const dc = selection.length > 1 ? selection[1].col - selection[0].col : 0;
    for (let i = 2; i < selection.length; i++) {
      if (
        selection[i].row - selection[i - 1].row !== dr ||
        selection[i].col - selection[i - 1].col !== dc
      ) {
        return '';
      }
    }
    return selection.map(({ row, col }) => grid[row][col]).join('');
  }

  const handleGameOver = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (props.onGameOver) props.onGameOver();
  };

  const restartGame = () => {
    setupGame();
    // No llames a props.onScoreChange aquí
  };

  // Formato mm:ss
  function formatTime(ms: number) {
    const totalSeconds = Math.floor(ms / 1000);
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Encuentra los animales:</Text>
      <View style={styles.wordsList}>
        {WORDS.map(word => (
          <Text
            key={word}
            style={[
              styles.wordItem,
              foundWords.includes(word) && styles.wordFound
            ]}
          >
            {word}
          </Text>
        ))}
      </View>
      <Text style={styles.timer}>Tiempo restante: {formatTime(timeLeft)}</Text>
      <View style={styles.grid}>
        {grid.length > 0 &&
          grid.map((rowArr, rowIdx) => (
            <View key={rowIdx} style={styles.gridRow}>
              {rowArr.map((letter, colIdx) => {
                const isSelected = selected.some(
                  (cell) => cell.row === rowIdx && cell.col === colIdx
                );
                const isFound = positions.some(
                  (cell) =>
                    cell.row === rowIdx &&
                    cell.col === colIdx &&
                    foundWords.includes(cell.word)
                );
                return (
                  <TouchableOpacity
                    key={colIdx}
                    style={[
                      styles.cell,
                      isSelected && styles.selectedCell,
                      isFound && styles.foundCell,
                    ]}
                    onPress={() => handleCellPress(rowIdx, colIdx)}
                    disabled={props.isGameOver || props.isPaused || foundWords.length === WORDS.length}
                  >
                    <Text style={styles.cellText}>{letter}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
      </View>
      <Text style={styles.scoreText}>Puntuación: <Text style={styles.score}>{score}</Text></Text>
      {props.isGameOver && (
        <Text style={styles.gameOverText}>¡Juego Terminado!</Text>
      )}
      {foundWords.length === WORDS.length && !props.isGameOver && (
        <Text style={styles.successText}>¡Sopaaaa completada!</Text>
      )}
      {props.onExit && (
        <TouchableOpacity
          style={styles.exitButton}
          onPress={props.onExit}
        >
          <Text style={styles.exitButtonText}>Salir</Text>
        </TouchableOpacity>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200ea',
    marginBottom: 6,
    textAlign: 'center',
  },
  wordsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 8,
  },
  wordItem: {
    fontSize: 16,
    color: '#d32f2f',
    marginHorizontal: 6,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  wordFound: {
    color: '#388e3c',
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  timer: {
    fontSize: 18,
    color: '#388e3c',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  grid: {
    marginVertical: 16,
  },
  gridRow: {
    flexDirection: 'row',
  },
  cell: {
    width: 32,
    height: 32,
    margin: 2,
    backgroundColor: '#e0d7f8',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  selectedCell: {
    backgroundColor: '#b39ddb',
  },
  foundCell: {
    backgroundColor: '#81c784',
  },
  cellText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3e2d6b',
  },
  successText: {
    fontSize: 18,
    color: '#388e3c',
    fontWeight: 'bold',
    marginTop: 12,
  },
  gameOverText: {
    fontSize: 18,
    color: '#d32f2f',
    fontWeight: 'bold',
    marginTop: 12,
  },
  scoreText: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: 'bold',
    color: '#6200ea',
  },
  score: {
    color: '#388e3c',
  },
  exitButton: {
    marginTop: 18,
    backgroundColor: '#d32f2f',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  exitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Sopa;