"use client"
import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { claimPrize, getDispute, placeBet } from "@/services/Web3Service";
import Web3 from "web3";
import Link from 'next/link';
import AdminNav from "../AdminNav";
import CandidateStatsCard from "../CandidateStatsCard";

export default function Bet() {
  const { push } = useRouter();
  const [message, setMessage] = useState("");
  const [showBetModal, setShowBetModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [betAmount, setBetAmount] = useState("");
  const [totalVotes, setTotalVotes] = useState(0);
  const [dispute, setDispute] = useState({
    candidate1: "Loading...",
    candidate2: "Loading...",
    image1: "/Anonymous_emblem.svg.png",
    image2: "/Anonymous_emblem.svg.png",
    total1: 0,
    total2: 0,
    candidate1_votes: 0,
    candidate2_votes: 0,
    winner: 0
  });

  useEffect(() => {
    if(!localStorage.getItem("wallet")) return push("/");
    setMessage("Obtendo dados da disputa... Aguarde...");
    getDispute()
      .then(dispute => {
        setDispute(dispute);
        setTotalVotes(Number(dispute.candidate1_votes) + Number(dispute.candidate2_votes))
        setMessage("");
      })
      .catch(err => {
        console.error(err);
        setMessage(err.message);
      });

  }, []);

  function openBetModal(candidate) {
    setSelectedCandidate(candidate);
    setShowBetModal(true);
  }

  function handleBetSubmit(e) {
    e.preventDefault();
    if (betAmount === null || isNaN(betAmount) || Number(betAmount) <= 0) {
      setMessage("Valor inválido. Por favor, insira um número positivo.");
      return;
    }

    setMessage("Conectando na carteira... Aguarde...");
    placeBet(selectedCandidate, betAmount)
      .then(() => {
        setShowBetModal(false);
        setBetAmount("");
        alert("Aposta recebida com sucesso. Pode demorar 1 minuto para que apareça no sistema.");
        setMessage("");
      })
      .catch(err => {
        console.error(err.data ? err.data : err);
        setMessage(err.data ? err.data.message : err.message);
      })
  }

  function btnClaimClick() {
    setMessage("Conectando na carteira... Aguarde...");
    claimPrize()
      .then(() => {
        alert("Prêmio coletado com sucesso. Pode demorar 1 minuto para que apareça na sua carteira.");
        setMessage("");
      })
      .catch(err => {
        console.error(err.data ? err.data : err);
        setMessage(err.data ? err.data.message : err.message);
      })
  }

  return (
    <>
      <Head>
        <title>BetCandidate | Bet</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
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
                <AdminNav />
              </div>
            </div>
          </nav>

          {/* Header */}
          <div className="text-center py-5">
            <h1 className="display-4 fw-bold mb-4">
              <span className="text-gradient">Eleições Americanas 2024</span>
            </h1>
            <p className="lead fw-normal text-light opacity-75 mb-2">
              Apostas on-chain nas eleições americanas.
            </p>
            {dispute.winner == 0 ? (
              <p className="lead fw-normal text-light opacity-75">
                Você tem até o dia 3 de Novembro de 2024 9:00 AM GMT-03 para deixar sua aposta em um dos candidatos abaixo.
              </p>
            ) : (
              <p className="lead fw-normal text-light opacity-75">
                Disputa encerrada. Veja o vencedor abaixo e solicite seu prêmio.
              </p>
            )}
          </div>

          {/* Candidates */}
          <div className="row justify-content-center g-4 py-4">
            {(dispute.winner == 0 || dispute.winner == 1) && (
              <div className="col-12 col-md-6 col-lg-5">
                <div className="candidate-card text-center">
                  <h3 className="fw-bold mb-4">{dispute.candidate1}</h3>
                  <div className="position-relative mb-4">
                    <img 
                      src={dispute.image1} 
                      className="img-fluid rounded-3 shadow-lg" 
                      style={{ width: '100%', maxWidth: '300px',
                        objectFit: 'cover' }}
                      alt={dispute.candidate1}
                    />
                  </div>
                  {dispute.winner == 1 ? (
                    <button className="btn btn-gradient btn-lg w-100 mb-4" onClick={btnClaimClick}>
                      Pegar meu prêmio
                    </button>
                  ) : (
                    <button className="btn btn-gradient btn-lg w-100 mb-4" onClick={() => openBetModal(1)}>
                      Aposto nesse candidato
                    </button>
                  )}
                  <CandidateStatsCard backgroundColor="card-gradient-3"
                    totalAmount={Web3.utils.fromWei(dispute.total1, "ether")}
                    totalVotes={totalVotes}
                    candidateVotes={Number(dispute.candidate1_votes)}
                  />
                </div>
              </div>
            )}

            {(dispute.winner == 0 || dispute.winner == 2) && (
              <div className="col-12 col-md-6 col-lg-5">
                <div className="candidate-card text-center">
                  <h3 className="fw-bold mb-4">{dispute.candidate2}</h3>
                  <div className="position-relative mb-4">
                    <img 
                      src={dispute.image2} 
                      className="img-fluid rounded-3 shadow-lg" 
                      style={{ width: '100%',
                        maxWidth: '303px',
                        objectFit: 'cover' }}
                      alt={dispute.candidate2}
                    />
                  </div>
                  {dispute.winner == 2 ? (
                    <button className="btn btn-gradient btn-lg w-100 mb-4" onClick={btnClaimClick}>
                      Pegar meu prêmio
                    </button>
                  ) : (
                    <button className="btn btn-gradient btn-lg w-100 mb-4" onClick={() => openBetModal(2)}>
                      Aposto nesse candidato
                    </button>
                  )}
                  <CandidateStatsCard backgroundColor="card-gradient-3"
                    totalAmount={Web3.utils.fromWei(dispute.total2, "ether")}
                    totalVotes={totalVotes}
                    candidateVotes={Number(dispute.candidate2_votes)}

                  />
                </div>
              </div>
            )}
          </div>

          {/* Modal de Apostas */}
        <div className={`modal fade ${showBetModal ? 'show' : ''}`} 
             style={{ display: showBetModal ? 'block' : 'none' }}
             tabIndex="-1"
             aria-labelledby="betModalLabel"
             aria-hidden="true">
          {/* Adicionando classe modal-sm para um modal menor */}
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content bg-dark text-light">
              <div className="modal-header border-secondary">
                <h5 className="modal-title fs-6" id="betModalLabel">
                  Apostar em {selectedCandidate === 1 ? dispute.candidate1 : dispute.candidate2}
                </h5>
                <button type="button" 
                        className="btn-close btn-close-white" 
                        onClick={() => setShowBetModal(false)}
                        aria-label="Close">
                </button>
              </div>
              <form onSubmit={handleBetSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="betAmount" className="form-label small">Quantia em POL para apostar:</label>
                    <div className="input-group input-group-sm">
                      <input
                        type="number"
                        className="form-control bg-dark text-light"
                        id="betAmount"
                        placeholder="Digite o valor"
                        value={betAmount}
                        onChange={(e) => setBetAmount(e.target.value)}
                        min="1"
                        step="1"
                        required
                      />
                      <span className="input-group-text bg-dark text-light">POL</span>
                    </div>
                  </div>
                  <div className="alert alert-info py-2 px-3 small">
                    <i className="bi bi-info-circle me-1"></i>
                    Permitido apenas uma aposta por carteira.
                  </div>
                </div>
                <div className="modal-footer border-secondary py-2">
                  <button type="button" 
                          className="btn btn-secondary btn-sm" 
                          onClick={() => setShowBetModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-gradient-modal btn-sm">
                    Confirmar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

              {/* Overlay do Modal */}
          {showBetModal && (
            <div className="modal-backdrop fade show"></div>
          )}

          {message && (
            <div className="alert alert-info text-center mt-4">
              {message}
            </div>
          )}

          {/* Footer */}
          <footer className="border-top border-secondary mt-5 py-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center">
              <p className="mb-0 text-light opacity-75">
                &copy; 2024 BetCandidate, Inc
              </p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}