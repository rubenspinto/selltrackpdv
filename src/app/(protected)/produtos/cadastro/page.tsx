import CadastroProdutoForm from "@/components/produtos/CadastroProdutoForm";

export const metadata = {
  title: "Cadastrar Produto — SellTrack PDV",
  description: "Cadastre um novo produto com suas variações no sistema.",
};

export default function CadastroProdutoPage() {
  return <CadastroProdutoForm />;
}
