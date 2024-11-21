document.addEventListener("DOMContentLoaded", function () {
    const archiveLimit = 7 * 24 * 60 * 60 * 1000; // Неделя в миллисекундах
    const sessionTimes = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];
    
    // Функция инициализации данных
    function init() {
        const today = new Date();
        const dateInput = document.getElementById("date");
        dateInput.min = getDateString(today);
        dateInput.max = getDateString(new Date(today.getTime() + archiveLimit));
        
        dateInput.addEventListener("change", loadSessions);
        loadSessions();
    }

    // Функция загрузки сеансов
    function loadSessions() {
        const sessionsContainer = document.querySelector(".sessions");
        sessionsContainer.innerHTML = '';
        const date = new Date(document.getElementById("date").value);
        
        sessionTimes.forEach(time => {
            const sessionTime = new Date(date);
            const [hours, minutes] = time.split(":");
            sessionTime.setHours(hours, minutes);
            
            const sessionEl = document.createElement("div");
            sessionEl.className = "session";
            sessionEl.textContent = time;
            if (sessionTime < new Date()) {
                sessionEl.classList.add("archived");
            } else {
                sessionEl.addEventListener("click", () => loadSeats(time));
            }
            sessionsContainer.appendChild(sessionEl);
        });
    }

    // Функция загрузки мест для выбранного сеанса
    function loadSeats(sessionTime) {
        const seatsContainer = document.querySelector(".seats");
        seatsContainer.innerHTML = '';
        const selectedDate = document.getElementById("date").value;
        
        // Загружаем из LocalStorage или создаем новый объект
        const sessionData = JSON.parse(localStorage.getItem(selectedDate + sessionTime)) || {};

        for (let row = 0; row < 5; row++) {
            for (let seat = 0; seat < 10; seat++) {
                const seatId = `R${row}S${seat}`;
                const seatEl = document.createElement("div");
                seatEl.className = "seat";
                seatEl.textContent = seatId;
                
                if (sessionData[seatId]) {
                    seatEl.classList.add("booked");
                } else {
                    seatEl.classList.add("available");
                    seatEl.addEventListener("click", function () {
                        sessionData[seatId] = true;
                        localStorage.setItem(selectedDate + sessionTime, JSON.stringify(sessionData));
                        loadSeats(sessionTime); // Перезагрузка мест для обновления статуса
                    });
                }
                seatsContainer.appendChild(seatEl);
            }
        }
    }

    // Вспомогательная функция для форматирования даты в строку "YYYY-MM-DD"
    function getDateString(date) {
        return date.toISOString().split("T")[0];
    }
    
    init();
});