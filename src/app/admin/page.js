"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isOwner, finishDispute, feeClaim, getDispute } from "@/services/Web3Service";
import Head from "next/head";
import Link from "next/link";
import Web3 from "web3";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// Componente DisputeStats
function DisputeStats({ 
  disputeData,
  totalAmount,
  totalFeesInEther,
  candidate1AmountInEther,
  candidate2AmountInEther
}) {
  if (!disputeData) return null;

  const totalVotes = Number(disputeData.candidate1_votes) + Number(disputeData.candidate2_votes);
  const candidate1Percentage = totalVotes == 0 ? 0 : (Number(disputeData.candidate1_votes) / totalVotes * 100).toFixed(1);
  const candidate2Percentage = totalVotes == 0 ? 0 : (Number(disputeData.candidate2_votes) / totalVotes * 100).toFixed(1);

  const pieData = [
    { name: disputeData.candidate1, value: Number(disputeData.candidate1_votes) },
    { name: disputeData.candidate2, value: Number(disputeData.candidate2_votes) }
  ];

  const COLORS = ['#0088FE', '#00C49F'];

  function getVoteLabel(count) {
    return count == 1 ? 'voto' : 'votos';
  }
  

  return (
    <div className="row g-4">
      <div className="col-md-8">
        <div className="row g-3">
          <div className="col-md-6">
            <div className="card bg-gradient h-100">
              <div className="card-body">
                <h6 className="text-muted mb-2">Volume Total de Apostas</h6>
                <h3 className="mb-3">{totalAmount} POL</h3>
                <div className="small">
                  <div className="d-flex justify-content-between mb-1">
                    <span>{disputeData.candidate1}:</span>
                    <span>{candidate1AmountInEther} POL</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>{disputeData.candidate2}:</span>
                    <span>{candidate2AmountInEther} POL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card bg-gradient h-100">
              <div className="card-body">
                <h6 className="text-muted mb-2">Taxas Acumuladas</h6>
                <h3 className="mb-3">{totalFeesInEther} POL</h3>
                <div className="small text-muted">
                  Taxa atual: 10%
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="card bg-gradient">
              <div className="card-body">
                <h6 className="text-muted mb-3">Distribuição de Votos</h6>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="text-center">
                    <h4>{disputeData.candidate1}</h4>
                    <div className="h5">{disputeData.candidate1_votes.toString()} {getVoteLabel(disputeData.candidate1_votes)}</div>
                    <div className="h3 text-primary">{candidate1Percentage}%</div>
                  </div>
                  <div className="text-center">
                    <h4>VS</h4>
                    <div className="small text-muted">Total: {totalVotes} {getVoteLabel(totalVotes)}</div>
                  </div>
                  <div className="text-center">
                    <h4>{disputeData.candidate2}</h4>
                    <div className="h5">{disputeData.candidate2_votes.toString()} {getVoteLabel(disputeData.candidate2_votes)}</div>
                    <div className="h3 text-success">{candidate2Percentage}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card bg-gradient h-100">
          <div className="card-body">
            <h6 className="text-muted mb-3">Distribuição Visual</h6>
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={0}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-3">
              <div className="d-flex justify-content-center gap-4">
                {pieData.map((entry, index) => (
                  <div key={index} className="d-flex align-items-center">
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: COLORS[index],
                        marginRight: '8px',
                        borderRadius: '2px'
                      }}
                    />
                    <span>{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Página Admin
export default function Admin() {
  const { push } = useRouter();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [disputeData, setDisputeData] = useState(null);

  useEffect(() => {
    checkOwnership();
  }, []);

  async function checkOwnership() {
    try {
      if (!localStorage.getItem("wallet")) {
        push("/");
        return;
      }

      const ownerStatus = await isOwner();
      if (!ownerStatus) {
        push("/");
        return;
      }

      setLoading(false);
      loadDisputeData();
    } catch (err) {
      console.error(err);
      push("/");
    }
  }

  async function loadDisputeData() {
    try {
      const data = await getDispute();
      setDisputeData(data);
    } catch (err) {
      console.error('Erro ao carregar dados da disputa:', err);
      setMessage("Erro ao carregar dados da disputa");
    }
  }

  async function handlefinishDispute(winner) {
    if (!confirm(`Confirma que o candidato ${winner} é o vencedor? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      setMessage("Finalizando disputa... Aguarde...");
      await finishDispute(winner);
      setMessage("Disputa finalizada com sucesso!");
      loadDisputeData();
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Erro ao finalizar disputa");
    }
  }

  async function handleFeeClaim() {
    try {
      setMessage("Realizando saque das taxas... Aguarde...");
      await feeClaim();
      setMessage("Taxas sacadas com sucesso!");
      loadDisputeData();
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Erro ao sacar taxas");
    }
  }

  if (loading || !disputeData) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-dark text-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

    const totalAmount = disputeData.total1 + disputeData.total2;
    const fees = totalAmount / BigInt(10);

  return (
    <>
      <Head>
        <title>BetCandidate | Admin</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="bg-gradient-dark min-vh-100 text-light">
        <div className="container px-4 py-5">
          {/* Navbar */}
          <nav className="navbar navbar-expand-lg navbar-dark">
            <div className="container-fluid">
              <Link href="/" className="navbar-brand text-gradient fw-bold fs-3">
                BetCandidate Admin
              </Link>
              <div className="navbar-nav ms-auto">
                <Link href="/" className="nav-link">Voltar ao Site</Link>
              </div>
            </div>
          </nav>

          {/* Admin Dashboard */}
          <div className="row mt-5">
            <div className="col-md-12">
              <div className="card bg-dark border-secondary">
                <div className="card-header border-secondary">
                  <h4 className="lead fw-normal text-light opacity-90 mb-0">Painel Administrativo</h4>
                </div>
                <div className="card-body">
                  {/* Estatísticas */}
                  <DisputeStats 
                    disputeData={disputeData}
                    totalAmount={Web3.utils.fromWei(totalAmount.toString(), 'ether')}
                    totalFeesInEther={Web3.utils.fromWei(fees.toString(), 'ether')}
                    candidate1AmountInEther={Web3.utils.fromWei(disputeData.total1, 'ether')}
                    candidate2AmountInEther={Web3.utils.fromWei(disputeData.total2, 'ether')}
                  />

                  {/* Status da Disputa */}
                  <div className="alert alert-info my-4">
                    <strong>Status da Disputa:</strong>{' '}
                    {disputeData.winner == 0 ? (
                        'Em andamento'
                    ) : (
                        `Finalizada - Vencedor: ${disputeData.winner === '1' ? disputeData.candidate1 : disputeData.candidate2}`
                    )}
                    </div>

                  {/* Ações Administrativas */}
                  {disputeData.winner == 0 && (
                    <div className="border-top border-secondary pt-4">
                      <h5 className="text-light opacity-75 mb-4">Ações Administrativas</h5>
                      
                      {/* Finalizar Disputa */}
                      <div className="mb-4">
                        <h6 className="text-light opacity-75">Finalizar Disputa</h6>
                        <p className="text-light opacity-75">
                          Escolha o vencedor para encerrar a disputa. Esta ação não pode ser desfeita.
                        </p>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-gradient-modal"
                            onClick={() => handlefinishDispute(1)}>
                            {disputeData.candidate1} Venceu
                          </button>
                          <button 
                            className="btn btn-gradient-modal"
                            onClick={() => handlefinishDispute(2)}>
                            {disputeData.candidate2} Venceu
                          </button>
                        </div>
                      </div>

                      {/* Sacar Taxas */}
                      <div>
                        <h6 className="text-light opacity-75">Sacar Taxas</h6>
                        <p className="text-light opacity-75">
                          Taxas disponíveis: {Web3.utils.fromWei(fees.toString(), 'ether')} POL
                        </p>
                        <button 
                          className="btn btn-gradient-modal mb-4"
                          onClick={handleFeeClaim}>
                          Sacar Taxas
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Mensagens de Status */}
              {message && (
                <div className="alert alert-info mt-4">
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
