export const metadata = {
	title: "WMS3D",
	description: "Un nuovo modo per gestire il magazzino tramite l'esperienza 3D",
};

const RootLayout = ({ children }) => {
	return (
		<html lang="it">
			<body 
				style={{
					display: 'flex',
					height: '100vh',
					width: '100vw',
					margin: 0,
					padding: 0,
					justifyContent: 'center',
					alignItems: 'center',
					fontFamily: 'sans-serif',
					backgroundColor: '#001529'
				}}
			>
				{ children }     
			</body>
		</html>
	);
};

export default RootLayout;