"use client";

import { AppShell } from "@/components/layout/AppShell";
import {
  MagnifyingGlass,
  ShoppingCart,
  Trash,
  Plus,
  Minus,
  CreditCard,
  HardHat,
} from "@phosphor-icons/react";
import { useState, useEffect } from "react";

interface CartItem {
  id: string;
  name: string;
  variant?: string;
  price: number;
  quantity: number;
}

export default function PdvPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cupomNumber, setCupomNumber] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: "1",
      name: "Camisa Polo",
      variant: "Azul / M",
      price: 50.0,
      quantity: 1,
    },
    { id: "2", name: "Meia Soquete", price: 10.0, quantity: 2 },
  ]);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const discount = 0;
  const total = subtotal - discount;

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Gera número do cupom apenas no cliente para evitar erro de hidratação
  useEffect(() => {
    setCupomNumber(Math.floor(Math.random() * 9000) + 1000);
  }, []);

  return (
    <AppShell showSidebar={false} showBreadcrumb={false} containerType="full">
      <div className="h-[calc(100vh-60px)] flex">
        {/* Left Panel - Search & Products */}
        <div className="flex-1 lg:w-[65%] bg-gray-900 p-4 flex flex-col">
          {/* Search Bar */}
          <div className="relative mb-4">
            <MagnifyingGlass
              weight="bold"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Buscar produto por nome ou SKU (F2)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full pl-12 pr-4 py-3
                bg-gray-800 border border-gray-700
                rounded-lg text-white placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                text-lg
              "
              autoFocus
            />
          </div>

          {/* Products Grid (Placeholder) */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800 rounded-full">
                <HardHat
                  weight="duotone"
                  className="w-10 h-10 text-amber-400"
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Módulo em Desenvolvimento
                </h2>
                <p className="text-gray-400 mt-2 max-w-md">
                  A busca e grid de produtos serão implementados em breve. Por
                  enquanto, itens de demonstração estão no carrinho.
                </p>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            <span>
              <kbd className="px-2 py-1 bg-gray-800 rounded text-gray-400">
                F2
              </kbd>{" "}
              Buscar
            </span>
            <span>
              <kbd className="px-2 py-1 bg-gray-800 rounded text-gray-400">
                F9
              </kbd>{" "}
              Finalizar
            </span>
            <span>
              <kbd className="px-2 py-1 bg-gray-800 rounded text-gray-400">
                Esc
              </kbd>{" "}
              Limpar
            </span>
          </div>
        </div>

        {/* Right Panel - Cart/Coupon */}
        <div className="w-full lg:w-[35%] bg-white flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2 text-gray-700">
              <ShoppingCart weight="fill" className="w-5 h-5" />
              <span className="font-semibold">
                Cupom #{cupomNumber ?? "----"}
              </span>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <ShoppingCart
                  weight="light"
                  className="w-16 h-16 mx-auto mb-4 text-gray-300"
                />
                <p>Carrinho vazio</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    {item.variant && (
                      <p className="text-sm text-gray-500">{item.variant}</p>
                    )}
                    <p className="text-emerald-600 font-semibold mt-1">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      <Minus weight="bold" className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="w-8 text-center font-medium text-gray-700">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      <Plus weight="bold" className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 hover:bg-red-100 rounded transition-colors"
                  >
                    <Trash weight="bold" className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer - Totals & Checkout */}
          <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Desconto</span>
                <span className="text-red-500">-R$ {discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t border-gray-200">
                <span>TOTAL</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </div>

            <button
              disabled={cart.length === 0}
              className="
                w-full py-4 rounded-xl
                bg-emerald-500 hover:bg-emerald-400
                disabled:bg-gray-300 disabled:cursor-not-allowed
                text-white font-bold text-lg
                flex items-center justify-center gap-2
                transition-colors
              "
            >
              <CreditCard weight="bold" className="w-6 h-6" />
              FINALIZAR (F9)
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
