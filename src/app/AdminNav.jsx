// components/AdminNav.jsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { isOwner } from '@/services/Web3Service';

export default function AdminNav() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkOwnership();
  }, []);

  async function checkOwnership() {
    try {
      const ownerStatus = await isOwner();
      setIsAdmin(ownerStatus);
    } catch (err) {
      console.error('Erro ao verificar ownership:', err);
      setIsAdmin(false);
    }
  }

  if (!isAdmin) return null;

  return (
    <Link href="/admin" className="nav-link position-relative">
      <i className="bi bi-shield-lock"></i>
      <span className="ms-1">Admin</span>
    </Link>
  );
}