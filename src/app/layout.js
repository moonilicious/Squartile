import '../../styles/globals.css';



export const metadata = {
  title: "Squartile",
  description: "Buy and trade land on an alien planet!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
