import { GameScreen } from './game/GameScreen';
import { ThemeProvider } from 'next-themes';

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <GameScreen />
    </ThemeProvider>
  );
}
