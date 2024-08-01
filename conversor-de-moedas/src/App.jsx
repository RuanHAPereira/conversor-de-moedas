import { useState, useEffect } from 'react';
import CurrencyInput from './CurrencyInput';

const App = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('BRL');
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [error, setError] = useState(null);
  const [usdRate, setUsdRate] = useState(null);
  const [eurRate, setEurRate] = useState(null);

  useEffect(() => {
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setCurrencies([...Object.keys(data.rates)]);
        setFromCurrency(data.base);
        setError(null);
        setUsdRate(data.rates.BRL); // Assumindo que a moeda de referência é BRL
        fetch('https://api.exchangerate-api.com/v4/latest/EUR')
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            setEurRate(data.rates.BRL); // Assumindo que a moeda de referência é BRL
          });
      })
      .catch(error => {
        setError('Failed to fetch currency data');
        console.error('There was a problem with the fetch operation:', error);
      });
  }, []);

  const handleConvert = () => {
    if (fromCurrency && toCurrency && amount) {
      fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          const rate = data.rates[toCurrency];
          setConvertedAmount((amount * rate).toFixed(2));
          setError(null);
        })
        .catch(error => {
          setError('Failed to convert currency');
          console.error('There was a problem with the fetch operation:', error);
        });
    }
  };

  return (
    <div className="app">
      <h1>Conversor de Moedas</h1>
      {usdRate && eurRate && (
        <div className="rates">
          <p>1 USD = {usdRate} BRL</p>
          <p>1 EUR = {eurRate} BRL</p>
        </div>
      )}
      <div className="converter">
        <CurrencyInput
          label="De:"
          value={fromCurrency}
          onChange={e => setFromCurrency(e.target.value)}
          options={currencies}
        />
        <CurrencyInput
          label="Para:"
          value={toCurrency}
          onChange={e => setToCurrency(e.target.value)}
          options={currencies}
        />
        <div className="input-group">
          <label>Quantia:</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </div>
        <button onClick={handleConvert}>Converter</button>
      </div>
      {error && <div className="error">{error}</div>}
      {convertedAmount && !error && (
        <div className="result">
          <h2>
            {amount} {fromCurrency} = {convertedAmount} {toCurrency}
          </h2>
        </div>
      )}
    </div>
  );
};

export default App;
