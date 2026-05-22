function scrollToSelector(selector) {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.addEventListener('DOMContentLoaded', () => {
  // Navigation & Smooth Scroll
  const links = [
    { id: 'btn-tratamientos', target: '#section-tratamientos' },
    { id: 'btn-presupuesto', target: '#section-presupuesto' },
    { id: 'btn-contacto', target: '#section-contacto' },
    { id: 'btn-ver-tratamientos', target: '#section-tratamientos' },
    { id: 'btn-calcula-presupuesto', target: '#section-estimador' }
  ];

  links.forEach(item => {
    document.getElementById(item.id)?.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToSelector(item.target);
    });
  });

  // Filters logic
  const chips = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('#tratamientos-lista .card');
  
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => { 
        c.classList.remove('active'); 
        c.setAttribute('aria-selected','false'); 
      });
      chip.classList.add('active');
      chip.setAttribute('aria-selected','true');
      
      const filtro = chip.dataset.filter;
      cards.forEach(card => {
        const zona = card.getAttribute('data-zona');
        card.style.display = (filtro === 'todos' || zona === filtro) ? '' : 'none';
      });
    });
  });

  // Estimador Express
  const estimadorOpciones = document.getElementById('estimador-opciones');
  const estimadorResultado = document.getElementById('estimador-resultado');

  const preciosOrientativos = {
    rejuvenecimiento: { titulo: 'Rejuvenecimiento facial', desde: 180, hasta: 320, notas: 'Incluye toxina en 1-2 zonas o peelings suaves.' },
    volumen: { titulo: 'Volumen labios/pómulos', desde: 240, hasta: 420, notas: '1 vial de ácido hialurónico premium.' },
    grasa: { titulo: 'Reducción grasa localizada', desde: 220, hasta: 480, notas: 'Mesoterapia lipolítica por sesión/área.' },
    capilar: { titulo: 'Densidad capilar', desde: 160, hasta: 300, notas: 'Mesoterapia + vitaminas, por sesión.' }
  };

  estimadorOpciones?.addEventListener('click', (e) => {
    const btn = e.target.closest('button.card');
    if (!btn) return;
    const key = btn.dataset.objetivo;
    const data = preciosOrientativos[key];
    if (!data) return;

    estimadorResultado.style.display = 'block';
    estimadorResultado.innerHTML = `
      <h3 style="margin-top:0;">${data.titulo}</h3>
      <p style="margin-bottom:12px;"><strong>Precio orientativo:</strong> ${data.desde}–${data.hasta} € por sesión.</p>
      <p style="font-size:14px; opacity:0.8;">${data.notes || data.notas}</p>
      <div style="display:flex; gap:12px; flex-wrap:wrap; margin-top:20px;">
        <a class="btn-primary small" href="https://wa.me/34600000000?text=Hola%20me%20interesa%20${encodeURIComponent(data.titulo)}" target="_blank" rel="noopener">Pedir cita por WhatsApp</a>
        <a class="btn-secondary small" href="#section-presupuesto" id="cta-ir-presupuesto">Solicitar presupuesto detallado</a>
      </div>
    `;
    
    estimadorResultado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    document.getElementById('cta-ir-presupuesto')?.addEventListener('click', (e2) => {
      e2.preventDefault();
      scrollToSelector('#section-presupuesto');
    });
  });

  // Form submit to WhatsApp
  document.getElementById('form-presupuesto')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const nombre = (fd.get('nombre') || '').toString().trim();
    const contacto = (fd.get('contacto') || '').toString().trim();
    const objetivo = (fd.get('objetivo') || '').toString().trim();
    
    const texto = `Hola, soy ${nombre}. Contacto: ${contacto}. Me interesa presupuesto para: ${objetivo || '—'}.`;
    const url = `https://wa.me/34600000000?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank', 'noopener');
  });
});