import React from 'react';

export default function CandidateStatsCard({
  totalAmount,
  totalVotes,
  candidateVotes,
  backgroundColor
}) {
  const votePercentage = totalVotes > 0
    ? ((candidateVotes / totalVotes) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="stats-card-container my-1">
      <div className={`stats-card ${backgroundColor}`}>
        <div className="card-content p-3">
          {/* Total Apostado */}
          <div className="stat-item">
            <div className="stat-info">
              <span className="stat-value">{totalAmount} POL Apostados</span>
            </div>
          </div>

          {/* Número de Apostas */}
          <div className="stat-item">
            <div className="stat-info">
              <span className="stat-value">
                {candidateVotes} {candidateVotes == 1 ? 'Aposta' : 'Apostas'}
              </span>
            </div>
          </div>

          {/* Porcentagem do Total */}
          <div className="stat-item">
            <div className="stat-info">
              <span className="stat-value">{votePercentage}%</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${votePercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}