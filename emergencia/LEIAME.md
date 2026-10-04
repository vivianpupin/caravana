# App de Emergência da família

Site separado do da Caravana. Na Netlify ele lê o ramo `claude/emergency-contacts-app-lo9kv0`, pasta `emergencia`.

- Os números e o endereço ficam todos em `index.html`.
- Ao mudar qualquer número, troque a versão em `sw.js` (`emergencia-v1` → `emergencia-v2`) para os celulares receberem a atualização.
- Só publica quando a mensagem do commit tiver `[publicar]` (mesma regra da Caravana).
