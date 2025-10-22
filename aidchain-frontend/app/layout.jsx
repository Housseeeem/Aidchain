import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: "Aidchain",
  description: "Blockchain-based file sharing",
};

export default function Layout({ children }) {
    return (
        <html lang="en">
            <body>
                <Navbar />
                {children}
            </body>
        </html>
    );
}