/* booking.js — Supabase-powered booking system (no backend needed) */

// ─── Supabase Config ────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://ihgyzkjaxdjscugzcpfe.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloZ3l6a2pheGRqc2N1Z3pjcGZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MTkzMDcsImV4cCI6MjA5NjI5NTMwN30.QxFZjQ2s1DGtwrUhA0vCzSN6zuqk35DSIiUyYIQS4dE';
const _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── Static Car Data (matches gallery.html data-car-id) ─────────────────────
const CAR_DATA = {
  1:  { id: 1,  name: 'Hyundai Creta',         category: 'Normal',  image: 'assets/img/Hyundai_Creta.png',          pricePerHour: 150,  pricePerDay: 999,   pricePerWeek: 5999  },
  2:  { id: 2,  name: 'Hyundai i20',            category: 'Normal',  image: 'assets/img/Hyundai_i20.png',            pricePerHour: 120,  pricePerDay: 799,   pricePerWeek: 4999  },
  3:  { id: 3,  name: 'Mahindra XUV700',        category: 'Normal',  image: 'assets/img/Mahindra_XUV700.png',        pricePerHour: 200,  pricePerDay: 1299,  pricePerWeek: 7999  },
  4:  { id: 4,  name: 'Maruti Suzuki Brezza',   category: 'Normal',  image: 'assets/img/Maruti_Suzuki_Brezza.png',   pricePerHour: 130,  pricePerDay: 899,   pricePerWeek: 5499  },
  5:  { id: 5,  name: 'Maruti Suzuki Swift',    category: 'Normal',  image: 'assets/img/Maruti_Suzuki_Swift.png',    pricePerHour: 100,  pricePerDay: 699,   pricePerWeek: 3999  },
  6:  { id: 6,  name: 'Tata Altroz',            category: 'Normal',  image: 'assets/img/Tata_Altroz.png',            pricePerHour: 110,  pricePerDay: 749,   pricePerWeek: 4499  },
  7:  { id: 7,  name: 'Tata Nexon',             category: 'Normal',  image: 'assets/img/Tata_Nexon.png',             pricePerHour: 140,  pricePerDay: 949,   pricePerWeek: 5799  },
  8:  { id: 8,  name: 'Tata Tiago',             category: 'Normal',  image: 'assets/img/Tata_Tiago.png',             pricePerHour: 90,   pricePerDay: 599,   pricePerWeek: 3499  },
  9:  { id: 9,  name: 'Mahindra Thar',          category: 'Normal',  image: 'assets/img/Thar.png',                   pricePerHour: 180,  pricePerDay: 1199,  pricePerWeek: 6999  },
  10: { id: 10, name: 'Maruti Wagon R',         category: 'Normal',  image: 'assets/img/Wagon_R.png',                pricePerHour: 95,   pricePerDay: 649,   pricePerWeek: 3799  },
  11: { id: 11, name: 'BMW M5',                 category: 'Luxury',  image: 'assets/img/BMW M5.png',                 pricePerHour: 500,  pricePerDay: 3999,  pricePerWeek: 24999 },
  12: { id: 12, name: 'Bugatti',                category: 'Luxury',  image: 'assets/img/Bugatti.png',                pricePerHour: 2000, pricePerDay: 14999, pricePerWeek: 89999 },
  13: { id: 13, name: 'Lamborghini',            category: 'Luxury',  image: 'assets/img/Lamborgini.png',             pricePerHour: 1500, pricePerDay: 11999, pricePerWeek: 74999 },
  14: { id: 14, name: 'McLaren',                category: 'Luxury',  image: 'assets/img/McLaren.png',                pricePerHour: 1200, pricePerDay: 9999,  pricePerWeek: 59999 },
  15: { id: 15, name: 'Rolls Royce',            category: 'Luxury',  image: 'assets/img/Rollas Royal.png',           pricePerHour: 1800, pricePerDay: 13999, pricePerWeek: 84999 },
};

// ─── DOM Ready ───────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const modal            = document.getElementById('bookingModal');
  const closeBtns        = document.querySelectorAll('.close-modal, .close-modal-btn');
  const bookingForm      = document.getElementById('bookingForm');
  const paymentStep      = document.getElementById('paymentStep');
  const successMessage   = document.getElementById('successMessage');
  const durationValue    = document.getElementById('durationValue');
  const durationUnit     = document.getElementById('durationUnit');
  const totalPriceDisplay= document.getElementById('totalPrice');
  const btnPayNow        = document.getElementById('btnPayNow');

  if (!modal) return; // booking modal not on this page

  let currentCar = null;

  // ── Open Modal (Book Now buttons) ──────────────────────────────────────────
  document.querySelectorAll('.btn-book, .btn-book-luxury').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();

      const carCard = btn.closest('[data-car-id]');
      const carId   = parseInt(carCard.getAttribute('data-car-id'));
      currentCar    = CAR_DATA[carId];

      if (!currentCar) {
        alert('Car data not found. Please refresh the page.');
        return;
      }

      // Populate modal
      document.getElementById('modalCarImage').src              = currentCar.image;
      document.getElementById('modalCarName').textContent       = currentCar.name;
      document.getElementById('modalCarCategory').textContent   = currentCar.category;
      document.getElementById('rateHour').textContent           = currentCar.pricePerHour.toLocaleString('en-IN');
      document.getElementById('rateDay').textContent            = currentCar.pricePerDay.toLocaleString('en-IN');
      document.getElementById('rateWeek').textContent           = currentCar.pricePerWeek.toLocaleString('en-IN');

      calculatePrice();

      // Show modal
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Reset sections
      bookingForm.classList.remove('hidden');
      paymentStep.classList.add('hidden');
      successMessage.classList.add('hidden');

      // Reset buttons
      const submitBtn = document.getElementById('btnPropose');
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Proceed to Payment'; }
      btnPayNow.disabled = false;
      btnPayNow.textContent = 'Pay Now';
    });
  });

  // ── Close Modal ────────────────────────────────────────────────────────────
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });

  // ── Price Calculation ──────────────────────────────────────────────────────
  const calculatePrice = () => {
    if (!currentCar) return 0;
    const value = parseInt(durationValue.value) || 0;
    const unit  = durationUnit.value;
    let total   = 0;
    if (unit === 'hour') total = value * currentCar.pricePerHour;
    else if (unit === 'day')  total = value * currentCar.pricePerDay;
    else if (unit === 'week') total = value * currentCar.pricePerWeek;
    totalPriceDisplay.textContent = total.toLocaleString('en-IN');
    return total;
  };

  durationValue.addEventListener('input', calculatePrice);
  durationUnit.addEventListener('change', calculatePrice);

  // ── Form Submit → Check dates then go to payment ───────────────────────────
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const bookingDate = document.getElementById('bookingDate').value;
    const startTime   = document.getElementById('startTime').value;
    const value       = parseInt(durationValue.value);
    const unit        = durationUnit.value;

    if (!bookingDate || !startTime) {
      alert('Please select both a date and a start time.');
      return;
    }

    const [year, month, day] = bookingDate.split('-').map(Number);
    const [hours, minutes]   = startTime.split(':').map(Number);
    const startDT = new Date(year, month - 1, day, hours, minutes);

    if (isNaN(startDT.getTime())) { alert('Invalid date/time.'); return; }
    if (startDT < new Date())     { alert('Booking date cannot be in the past.'); return; }
    if (value <= 0)               { alert('Duration must be greater than 0.'); return; }

    const submitBtn = document.getElementById('btnPropose');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Checking...';

    // Check for conflicts in Supabase
    const endDT = new Date(startDT.getTime());
    if (unit === 'hour') endDT.setHours(endDT.getHours() + value);
    else if (unit === 'day')  endDT.setDate(endDT.getDate() + value);
    else if (unit === 'week') endDT.setDate(endDT.getDate() + value * 7);

    try {
      const { data: conflicts, error } = await _supabase
        .from('bookings')
        .select('id')
        .eq('car_id', currentCar.id)
        .lt('start_datetime', endDT.toISOString())
        .gt('end_datetime', startDT.toISOString());

      if (error) throw error;

      if (conflicts && conflicts.length > 0) {
        alert('This car is already booked for that time. Please choose different dates.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Proceed to Payment';
        return;
      }

      // All clear — show payment step
      bookingForm.classList.add('hidden');
      paymentStep.classList.remove('hidden');
    } catch (err) {
      console.error('Booking check error:', err);
      // If table doesn't exist yet or Supabase is unreachable, skip check and proceed in demo mode
      if (err.code === '42P01' || err.name === 'TypeError' || String(err).includes('fetch')) {
        bookingForm.classList.add('hidden');
        paymentStep.classList.remove('hidden');
      } else {
        alert('Error checking availability. Please try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Proceed to Payment';
      }
    }
  });

  // ── Pay Now → Save to Supabase ─────────────────────────────────────────────
  btnPayNow.addEventListener('click', async () => {
    if (btnPayNow.disabled) return;

    btnPayNow.disabled = true;
    btnPayNow.textContent = 'Processing...';

    const bookingDate = document.getElementById('bookingDate').value;
    const startTime   = document.getElementById('startTime').value;
    const value       = parseInt(durationValue.value);
    const unit        = durationUnit.value;
    const fullName    = document.getElementById('fullName').value;
    const contact     = document.getElementById('contactNumber').value;

    const [y, m, d]   = bookingDate.split('-').map(Number);
    const [h, min]    = startTime.split(':').map(Number);
    const startDT     = new Date(y, m - 1, d, h, min);
    const endDT       = new Date(startDT.getTime());

    if (unit === 'hour') endDT.setHours(endDT.getHours() + value);
    else if (unit === 'day')  endDT.setDate(endDT.getDate() + value);
    else if (unit === 'week') endDT.setDate(endDT.getDate() + value * 7);

    // Get current user (real Supabase session)
    let user = null;
    try {
      const { data } = await _supabase.auth.getUser();
      user = data ? data.user : null;
    } catch (e) {
      console.warn('Failed to retrieve supabase user:', e);
    }
    const totalPrice = calculatePrice();

    const bookingData = {
      car_id:         currentCar.id,
      car_name:       currentCar.name,
      car_image:      currentCar.image,
      car_category:   currentCar.category,
      full_name:      fullName,
      contact_number: contact,
      booking_date:   bookingDate,
      start_time:     startTime,
      start_datetime: startDT.toISOString(),
      end_datetime:   endDT.toISOString(),
      duration_value: value,
      duration_unit:  unit,
      total_price:    totalPrice,
      booking_status: 'confirmed',
      user_id:        user ? user.id : null,
    };

    try {
      const { error } = await _supabase.from('bookings').insert([bookingData]);
      if (error) throw error;

      // SUCCESS
      paymentStep.classList.add('hidden');
      successMessage.classList.remove('hidden');

      const dateClean = new Date(bookingDate).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric'
      });
      document.getElementById('bookingSummary').innerHTML = `
        <div class="summary-item"><span>Car:</span> <span>${currentCar.name}</span></div>
        <div class="summary-item"><span>Date:</span> <span>${dateClean} at ${startTime}</span></div>
        <div class="summary-item"><span>Duration:</span> <span>${value} ${unit}(s)</span></div>
        <div class="summary-item"><span>Total Price:</span> <span style="color: var(--primary-orange); font-weight: 700;">₹${totalPrice.toLocaleString('en-IN')}</span></div>
      `;
    } catch (err) {
      console.error('Booking save error:', err);
      if (err.code === '42P01') {
        // Table doesn't exist — show success anyway (demo mode)
        paymentStep.classList.add('hidden');
        successMessage.classList.remove('hidden');
        document.getElementById('bookingSummary').innerHTML = `
          <div class="summary-item"><span>Car:</span> <span>${currentCar.name}</span></div>
          <div class="summary-item"><span>Total Price:</span> <span style="color:var(--primary-orange);font-weight:700;">₹${totalPrice.toLocaleString('en-IN')}</span></div>
          <p style="color:#aaa;font-size:0.8rem;margin-top:10px;">⚠️ Demo mode: bookings table not yet created.</p>
        `;
      } else {
        alert('Booking failed: ' + (err.message || 'Unknown error'));
        btnPayNow.disabled = false;
        btnPayNow.textContent = 'Pay Now';
      }
    }
  });

  // ── Set min booking date to today ──────────────────────────────────────────
  const todayStr = new Date().toLocaleDateString('sv-SE');
  const dateInput = document.getElementById('bookingDate');
  if (dateInput) dateInput.setAttribute('min', todayStr);
});
