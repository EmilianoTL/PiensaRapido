import { View, StyleSheet } from 'react-native';
import Screen from '@components/Screen';
import AuthButtons from '@components/AuthButtons';
import ProfileForm from '@components/ProfileForm';
import { useEffect, useState } from 'react';
import { FIREBASE_AUTH } from '../../FirebaseConfig';

export default function Profile() {
  const [user, setUser] = useState(FIREBASE_AUTH.currentUser);

  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged((u) => {
      setUser(u);
    });
    return unsubscribe;
  }, []);

  return (
    <Screen>
      <View style={styles.container}>
        {user && <ProfileForm />}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <AuthButtons />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

