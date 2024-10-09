"use client";
import Head from "next/head";
import Link from "next/link";

export default function About() {
  return (
    <>
      <Head>
        <title>BetCandidate | Sobre</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="bg-gradient-dark min-vh-100 text-light">
        <div className="container px-4 py-5">
          {/* Header Section */}
          <div className="row align-items-center g-5 py-5">
            <div className="col-12 col-lg-6">
              <h1 className="display-4 fw-bold text-gradient lh-1 mb-4">
                Sobre o BetCandidate
              </h1>
              <div className="fs-5 opacity-75">
                <p>
                  O BetCandidate é uma plataforma descentralizada de apostas
                  políticas focada nas eleições presidenciais americanas.
                </p>
                <p>
                  Nossa missão é trazer transparência e confiabilidade ao mundo
                  das apostas eleitorais através da tecnologia blockchain.
                </p>
                <h2 className="h4 mt-4 mb-3 text-light">Como funciona?</h2>
                <ul className="list-unstyled">
                  <li className="mb-2">✓ Conecte sua carteira MetaMask</li>
                  <li className="mb-2">✓ Escolha seu candidato</li>
                  <li className="mb-2">✓ Defina o valor da aposta</li>
                  <li className="mb-2">✓ Acompanhe os resultados</li>
                </ul>
                <h2 className="h4 mt-4 mb-3 text-light">Por que usar blockchain?</h2>
                <p>Utilizamos contratos inteligentes para garantir:</p>
                <ul className="list-unstyled">
                  <li className="mb-2">✓ Transparência nas apostas</li>
                  <li className="mb-2">✓ Pagamentos automáticos</li>
                  <li className="mb-2">✓ Segurança dos fundos</li>
                  <li className="mb-2">✓ Imutabilidade dos resultados</li>
                </ul>
              </div>
            </div>

            {/* Image Section */}
            <div className="col-12 col-lg-6 text-center">
              <img
                src="/polygon.png"
                alt="Eleições Americanas"
                className="img-fluid rounded"
                style={{ maxWidth: "100%", height: "auto", maxWidth: '350px' }}
              />
            </div>
          </div>

          {/* Footer Section */}
          <footer className="border-top border-secondary mt-5 py-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center">
              <p className="mb-0 text-light opacity-75">&copy; 2024 BetCandidate, Inc</p>
              <ul className="nav">
                <li className="nav-item">
                  <Link href="/" className="nav-link text-light opacity-75">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/about" className="nav-link text-light opacity-75">
                    About
                  </Link>
                </li>
              </ul>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
