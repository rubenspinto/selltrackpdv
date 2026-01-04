"use client";

import { AppShell } from "@/components/layout/AppShell";
import {
  ChartLineUp,
  Package,
  CurrencyDollar,
  ShoppingCart,
} from "@phosphor-icons/react";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: {
    value: string;
    positive: boolean;
  };
}

function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {trend && (
            <p
              className={`text-sm mt-2 ${
                trend.positive ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {trend.positive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        <div className="p-3 bg-gray-800 rounded-lg">
          <Icon weight="duotone" className="w-6 h-6 text-emerald-400" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">
            Bem-vindo ao SellTrack PDV. Visão geral do seu negócio.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Vendas Hoje"
            value="R$ 1.250,00"
            icon={CurrencyDollar}
            trend={{ value: "12% vs ontem", positive: true }}
          />
          <StatCard
            title="Pedidos"
            value="23"
            icon={ShoppingCart}
            trend={{ value: "5% vs ontem", positive: true }}
          />
          <StatCard title="Produtos" value="156" icon={Package} />
          <StatCard
            title="Ticket Médio"
            value="R$ 54,35"
            icon={ChartLineUp}
            trend={{ value: "3% vs ontem", positive: false }}
          />
        </div>

        {/* Placeholder Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Vendas Recentes
            </h2>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0"
                >
                  <div>
                    <p className="text-white font-medium">Pedido #{1000 + i}</p>
                    <p className="text-gray-400 text-sm">Há {i * 10} minutos</p>
                  </div>
                  <p className="text-emerald-400 font-semibold">
                    R$ {(Math.random() * 200 + 50).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Produtos com Baixo Estoque
            </h2>
            <div className="space-y-3">
              {[
                { name: "Camisa Polo (P)", stock: 2, min: 5 },
                { name: "Calça Jeans (40)", stock: 1, min: 3 },
                { name: "Cinto Couro Preto", stock: 3, min: 5 },
              ].map((product, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0"
                >
                  <div>
                    <p className="text-white font-medium">{product.name}</p>
                    <p className="text-gray-400 text-sm">
                      Mínimo: {product.min} unidades
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 text-sm font-semibold rounded">
                    {product.stock} un.
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
