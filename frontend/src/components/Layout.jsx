import Header from "./Header";

function Layout({ children }) {
    return (
        <>
            <Header />
            <div
                style={{
                    maxWidth: "1400px",
                    margin: "30px auto",
                    padding: "20px"
                }}
            >
                {children}
            </div>
        </>
    );
}

export default Layout;