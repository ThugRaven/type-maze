import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Link from 'next/link';

const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900',
});
const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900',
});
const montserrat = localFont({
	src: './fonts/Montserrat.ttf',
	variable: '--font-montserrat',
	weight: '100 900',
});
});

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="h-full">
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${robotoMono.variable} antialiased h-full`}
			>
				<div className="grid grid-rows-[auto_1fr] items-center justify-items-center h-full gap-16 font-[family-name:var(--font-geist-sans)]">
					<nav>
						<ul className="flex gap-4 p-4">
							<li>
								<Link href="/">TypeMaze</Link>
							</li>
							<li>
								<Link href="/daily/easy">Daily - Easy</Link>
							</li>
							<li>
								<Link href="/daily/normal">Daily - Normal</Link>
							</li>
							<li>
								<Link href="/daily/hard">Daily - Hard</Link>
							</li>
						</ul>
					</nav>
					<main className="flex flex-col gap-8 items-center">{children}</main>
				</div>
			</body>
		</html>
	);
}
