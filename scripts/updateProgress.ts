import { promises as fs } from 'fs';
import path from 'path';

const scoresPath = path.join(__dirname, '..', 'assets', 'scores.json');
const progressPath = path.join(__dirname, '..', 'assets', 'progress.json');

// Definir el tipo explícito para las categorías válidas
const validCategories = ['memoria', 'atencion', 'razonamiento', 'calculo'] as const;
type Category = typeof validCategories[number];

const gameCategories: { [key: string]: Category } = {
  '101': 'memoria',
  '102': 'memoria',
  '103': 'memoria',
  '104': 'atencion',
  '105': 'atencion',
  '106': 'atencion',
  '201': 'razonamiento',
  '301': 'calculo',
};

async function updateProgress() {
  try {
    const scoresData = await fs.readFile(scoresPath, 'utf-8');
    const scores = JSON.parse(scoresData);

    let progressData;
    try {
      progressData = JSON.parse(await fs.readFile(progressPath, 'utf-8'));
    } catch (error) {
      progressData = {
        progreso: {
          memoria: 0,
          atencion: 0,
          razonamiento: 0,
          calculo: 0,
        },
        Racha: {
          currentday: '',
          lunes: '',
          martes: '',
          miercoles: '',
          jueves: '',
          viernes: '',
          sabado: '',
          domingo: '',
        },
      };
    }

    const newProgress = {
      memoria: 0,
      atencion: 0,
      razonamiento: 0,
      calculo: 0,
    };

    for (const gameId in scores) {
      const category = gameCategories[gameId];
      if (category) {
        newProgress[category] += scores[gameId].lastScore;
      }
    }

    progressData.progreso = newProgress;

    const today = new Date().toLocaleDateString('es-ES', { weekday: 'long' });
    progressData.Racha.currentday = today;
    
    // Logic to update streak will be added here

    await fs.writeFile(progressPath, JSON.stringify(progressData, null, 2));
    console.log('Progress updated successfully.');
  } catch (error) {
    console.error('Error updating progress:', error);
  }
}

updateProgress();
