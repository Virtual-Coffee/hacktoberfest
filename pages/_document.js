import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx)
		return { ...initialProps }
	}

	render() {
		return (
			<Html lang="en">
				<Head>
					<meta charset="UTF-8" />
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
					/>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

export default MyDocument
