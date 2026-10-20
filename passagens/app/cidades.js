// Cidades pelo código IATA da cidade (SAO junta Guarulhos, Congonhas e Viracopos; RIO junta Galeão e Santos Dumont).
// As do Brasil aparecem como cidade de saída. Destino fora desta lista aparece com o código.
export const CIDADES = {
  SAO: { nome: "São Paulo", pais: "BR" }, RIO: { nome: "Rio de Janeiro", pais: "BR" }, BSB: { nome: "Brasília", pais: "BR" },
  BHZ: { nome: "Belo Horizonte", pais: "BR" }, SSA: { nome: "Salvador", pais: "BR" }, REC: { nome: "Recife", pais: "BR" },
  FOR: { nome: "Fortaleza", pais: "BR" }, NAT: { nome: "Natal", pais: "BR" }, MCZ: { nome: "Maceió", pais: "BR" },
  JPA: { nome: "João Pessoa", pais: "BR" }, AJU: { nome: "Aracaju", pais: "BR" }, BEL: { nome: "Belém", pais: "BR" },
  MAO: { nome: "Manaus", pais: "BR" }, CWB: { nome: "Curitiba", pais: "BR" }, FLN: { nome: "Florianópolis", pais: "BR" },
  POA: { nome: "Porto Alegre", pais: "BR" }, GYN: { nome: "Goiânia", pais: "BR" }, CGB: { nome: "Cuiabá", pais: "BR" },
  CGR: { nome: "Campo Grande", pais: "BR" }, VIX: { nome: "Vitória", pais: "BR" }, SLZ: { nome: "São Luís", pais: "BR" },
  THE: { nome: "Teresina", pais: "BR" }, IGU: { nome: "Foz do Iguaçu", pais: "BR" }, NVT: { nome: "Navegantes", pais: "BR" },
  BPS: { nome: "Porto Seguro", pais: "BR" }, FEN: { nome: "Fernando de Noronha", pais: "BR" }, IOS: { nome: "Ilhéus", pais: "BR" },
  JJD: { nome: "Jericoacoara", pais: "BR" }, UDI: { nome: "Uberlândia", pais: "BR" }, LDB: { nome: "Londrina", pais: "BR" },
  BUE: { nome: "Buenos Aires", pais: "AR" }, BRC: { nome: "Bariloche", pais: "AR" }, MDZ: { nome: "Mendoza", pais: "AR" },
  USH: { nome: "Ushuaia", pais: "AR" }, SCL: { nome: "Santiago", pais: "CL" }, MVD: { nome: "Montevidéu", pais: "UY" },
  PDP: { nome: "Punta del Este", pais: "UY" }, ASU: { nome: "Assunção", pais: "PY" }, LIM: { nome: "Lima", pais: "PE" },
  CUZ: { nome: "Cusco", pais: "PE" }, BOG: { nome: "Bogotá", pais: "CO" }, CTG: { nome: "Cartagena", pais: "CO" },
  PTY: { nome: "Cidade do Panamá", pais: "PA" }, CUN: { nome: "Cancún", pais: "MX" }, MEX: { nome: "Cidade do México", pais: "MX" },
  PUJ: { nome: "Punta Cana", pais: "DO" }, AUA: { nome: "Aruba", pais: "AW" }, MIA: { nome: "Miami", pais: "US" },
  ORL: { nome: "Orlando", pais: "US" }, NYC: { nome: "Nova York", pais: "US" }, LAX: { nome: "Los Angeles", pais: "US" },
  TOR: { nome: "Toronto", pais: "CA" }, LIS: { nome: "Lisboa", pais: "PT" }, OPO: { nome: "Porto", pais: "PT" },
  MAD: { nome: "Madri", pais: "ES" }, BCN: { nome: "Barcelona", pais: "ES" }, PAR: { nome: "Paris", pais: "FR" },
  ROM: { nome: "Roma", pais: "IT" }, MIL: { nome: "Milão", pais: "IT" }, LON: { nome: "Londres", pais: "GB" },
  AMS: { nome: "Amsterdã", pais: "NL" }, FRA: { nome: "Frankfurt", pais: "DE" }, ZRH: { nome: "Zurique", pais: "CH" },
  ATH: { nome: "Atenas", pais: "GR" }, IST: { nome: "Istambul", pais: "TR" }, CAI: { nome: "Cairo", pais: "EG" },
  DXB: { nome: "Dubai", pais: "AE" }, TLV: { nome: "Tel Aviv", pais: "IL" }, DEL: { nome: "Nova Délhi", pais: "IN" },
  BOM: { nome: "Mumbai", pais: "IN" }, KTM: { nome: "Katmandu", pais: "NP" }, BKK: { nome: "Bangkok", pais: "TH" },
  TYO: { nome: "Tóquio", pais: "JP" }, JNB: { nome: "Joanesburgo", pais: "ZA" }, CPT: { nome: "Cidade do Cabo", pais: "ZA" }
};

export const CIAS = {
  LA: "LATAM", G3: "GOL", AD: "Azul", TP: "TAP", AF: "Air France", KL: "KLM", IB: "Iberia", UX: "Air Europa",
  AA: "American", UA: "United", DL: "Delta", CM: "Copa", AR: "Aerolíneas Argentinas", AV: "Avianca", H2: "Sky",
  JA: "JetSMART", EK: "Emirates", QR: "Qatar", TK: "Turkish", LH: "Lufthansa", LX: "Swiss", BA: "British", AZ: "ITA",
  ET: "Ethiopian", MS: "EgyptAir", SA: "South African", AM: "Aeroméxico", "2Z": "Voepass"
};
