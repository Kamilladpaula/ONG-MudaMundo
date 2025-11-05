// ==============================================================
// =================== VALIDAÇÃO DE FORMS =======================
// ==============================================================

export function aplicarMascaras() {
  const aplicarMascara = (selector, mascaraFn) => {
    document.querySelectorAll(selector).forEach(input => {
      input.addEventListener('input', e => mascaraFn(e.target));
    });
  };

  const mascaraCPF = (input) => {
    let value = input.value.replace(/\D/g, '').substring(0, 11);
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    input.value = value;
  };

  const mascaraTelefone = (input) => {
    let value = input.value.replace(/\D/g, '').substring(0, 11);
    value = value.replace(/(\d{2})(\d)/, '($1) $2');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
    input.value = value;
  };

  const mascaraCEP = (input) => {
    let value = input.value.replace(/\D/g, '').substring(0, 8);
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
    input.value = value;
  };

  aplicarMascara('input[name*="cpf"], #cpf, #cpf-doador', mascaraCPF);
  aplicarMascara('input[name*="telefone"]', mascaraTelefone);
  aplicarMascara('input[name*="cep"]', mascaraCEP);
}

export function validarEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}