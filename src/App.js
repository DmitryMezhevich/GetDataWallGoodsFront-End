import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import './MyForm.css'; // Импорт стилей для формы
import './styles.css'; // Импорт общих стилей

const MyForm = () => {
    const [noLessReposts, setNoLessReposts] = useState('');
    const [noMoreReposts, setNoMoreReposts] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formMessage, setFormMessage] = useState('');
    const [items, setItems] = useState([]);
    const [allChecked, setAllChecked] = useState(true);

    useEffect(() => {
        const now = moment().format('YYYY-MM-DDTHH:mm'); // Форматируем дату для input type="datetime-local"
        setStartDate(now);
        setEndDate(now);
    }, []);

    const formatDateTime = (dateTime) => {
        return moment(dateTime).unix(); // Преобразуем дату в Unix timestamp
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Validate date fields
        if (!startDate || !endDate) {
            setFormMessage('Пожалуйста, заполните оба поля даты.');
            return;
        }

        // Format dates for server submission
        const formattedStartDate = formatDateTime(startDate);
        const formattedEndDate = formatDateTime(endDate);

        // Create the data object
        const data = {
            noLessReposts,
            noMoreReposts,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
        };

        // Set submitting state and clear any previous message
        setIsSubmitting(true);
        setFormMessage('');

        // Send the data to the server
        axios
            .post('https://getdatawall.onrender.com/wall-api/get', data, {
                headers: { 'Content-Type': 'application/json' },
            })
            .then((res) => {
                const item = res.data;
                setFormMessage(`Успешно! Всего: ${item.count}.`);
            })
            .catch((error) => {
                setFormMessage('Произошла ошибка при отправке данных.');
                console.error('Error:', error);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <div className="input-group">
                <div className="input-field">
                    <label>Не менее репостов</label>
                    <input
                        type="number"
                        value={noLessReposts}
                        onChange={(e) => setNoLessReposts(e.target.value)}
                    />
                </div>
                <div className="input-field">
                    <label>Не более репостов</label>
                    <input
                        type="number"
                        value={noMoreReposts}
                        onChange={(e) => setNoMoreReposts(e.target.value)}
                    />
                </div>
            </div>

            <div className="input-group">
                <div className="input-field">
                    <label>Начальная дата</label>
                    <input
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </div>
                <div className="input-field">
                    <label>Конечная дата</label>
                    <input
                        type="datetime-local"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Обработка...' : 'Отправить'}
            </button>

            {formMessage && (
                <div
                    className={`form-message ${
                        formMessage.includes('Успешно') ? 'success' : 'error'
                    }`}
                >
                    {formMessage}
                </div>
            )}
        </form>
    );
};

export default MyForm;
