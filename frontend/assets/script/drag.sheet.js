// --- Drag to dismiss bottom sheet ----
function openSheet(id) {
    const sheet = document.getElementById(id);
    document.getElementById('sheet-overlay').classList.add('show');
    sheet.classList.add('show');
    document.body.style.overflow = 'hidden';
    initDrag(sheet);
  }
  
  function closeSheet() {
    document.getElementById('sheet-overlay').classList.remove('show');
    document.querySelectorAll('.bottom-sheet').forEach(s => {
      s.classList.remove('show');
      s.style.transform = '';
      s.style.transition = '';
    });
    document.body.style.overflow = '';
  }
  
  function initDrag(sheet) {
    let startY = 0;
    let currentY = 0;
    let isDragging = false;
  
    const onStart = (e) => {
      // only drag from handle or header area
      const touch = e.touches ? e.touches[0] : e;
      // console.log(touch);
      startY = touch.clientY;
      currentY = 0;
      isDragging = true;
      sheet.style.transition = 'none'; // disable animation while dragging
    };
  
    const onMove = (e) => {
      if (!isDragging) return;
      const touch = e.touches ? e.touches[0] : e;
      currentY = touch.clientY - startY;
      if (currentY < 0) currentY = 0; // prevent dragging up
      sheet.style.transform = `translateY(${currentY}px)`;
    };
  
    const onEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      sheet.style.transition = ''; // re-enable animation
  
      const threshold = sheet.offsetHeight * 0.3; // 30% of sheet height
      if (currentY > threshold) {
        // dragged past threshold → dismiss
        sheet.style.transform = `translateY(100%)`;
        setTimeout(closeSheet, 300);
      } else {
        // snaps back
        sheet.style.transform = '';
      }
    };
  
    // remove old listeners first to avoid duplicates
    sheet.removeEventListener('touchstart', sheet._dragStart);
    sheet.removeEventListener('touchmove',  sheet._dragMove);
    sheet.removeEventListener('touchend',   sheet._dragEnd);
  
    // store references so we can remove them later
    sheet._dragStart = onStart;
    sheet._dragMove  = onMove;
    sheet._dragEnd   = onEnd;
  
    sheet.addEventListener('touchstart', onStart, { passive: true });
    sheet.addEventListener('touchmove',  onMove,  { passive: true });
    sheet.addEventListener('touchend',   onEnd);
  }
  