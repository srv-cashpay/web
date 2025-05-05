import getConfig from 'next/config';
import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render() {
        const contextPath = getConfig().publicRuntimeConfig.contextPath;

        return (
            <Html lang="en">
                <Head>
                    <link id="theme-css" href={`${contextPath}/themes/lara-light-indigo/theme.css`} rel="stylesheet"></link>
                    <script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key="SB-Mid-client-iyhnateg4Lp64gtl"></script>
                    {/* <script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key="SB-Mid-server-tEhXc7DgvrhK9vysgHwMU-bF"></script> */}

                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
