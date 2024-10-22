"use client";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { doLogin } from "@/services/Web3Service";
import Link from "next/link";

export default function Home() {
  const { push } = useRouter();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function btnLoginClick() {
    setIsLoading(true);
    setMessage("Conectando na carteira... Aguarde...");
    doLogin()
      .then(account => push("/bet"))
      .catch(error => {
        console.log(error);
        setMessage(error.message);
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <>
      <Head>
        <title>BetCandidate | Login</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="bg-gradient-dark min-vh-100 text-light">
        <div className="container px-4 py-5">
          {/* Navbar */}
          <nav className="navbar navbar-expand-lg navbar-dark">
            <div className="container-fluid">
              <Link href="/" className="navbar-brand text-gradient fw-bold fs-3">
                BetCandidate
              </Link>
              <div className="navbar-nav ms-auto">
                <Link href="/" className="nav-link">Home</Link>
                <Link href="/about" className="nav-link">About</Link>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <div className="row align-items-center py-5 mt-5">
            <div className="col-lg-6 order-lg-2">
              <div className="image-container">
                <img
                  src="/harris-trump.jpg"
                  className="img-fluid rounded shadow-lg"
                  alt="Eleições Americanas"
                />
              </div>
            </div>

            <div className="col-lg-6 order-lg-1">
              <h1 className="display-4 fw-bold mb-4">
                <span className="text-gradient">Aposte no Futuro</span>
                <br />
                da Política Americana
              </h1>

              <p className="lead fw-normal text-light opacity-75 mb-2">
                Experimente a próxima geração de apostas eleitorais. Com a tecnologia blockchain, garantimos total transparência e segurança.
              </p>
              <p className="lead fw-normal text-light opacity-75 mb-4">
                Conecte sua carteira e esteja pronto para se envolver nas próximas eleições com apenas alguns cliques.
              </p>

              <div className="mb-4">
                <button
                  onClick={btnLoginClick}
                  disabled={isLoading}
                  className="btn btn-gradient btn-lg d-inline-flex align-items-center gap-3 px-4 py-3 shadow-lg"
                  style={{ background: "linear-gradient(90deg, #4CAF50, #1E90FF)" }}
                >
                  <img
                    src="/metamask.svg"
                    width={32}
                    height={32}
                    alt="MetaMask"
                    className="me-2"
                  />
                  {isLoading ? "Conectando..." : "Conectar MetaMask"}
                </button>

                {message && (
                  <div className="alert alert-info mt-3">
                    {message}
                  </div>
                )}
              </div>

              <div className="d-flex flex-wrap gap-4 mt-4">
                <div className="d-flex align-items-center">
                  <span className="status-dot bg-success me-2"></span>
                  <small className="text-light fw-semibold opacity-75">Pagamentos Automáticos</small>
                </div>
                <div className="d-flex align-items-center">
                  <span className="status-dot bg-primary me-2"></span>
                  <small className="text-light fw-semibold opacity-75">100% On-chain</small>
                </div>
                <div className="d-flex align-items-center">
                  <span className="status-dot bg-purple me-2"></span>
                  <small className="text-light fw-semibold opacity-75">Resultados Verificados</small>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <footer className="border-top border-secondary mt-5 py-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center">
              <p className="mb-0 text-light opacity-75">&copy; 2024 BetCandidate, Inc</p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
