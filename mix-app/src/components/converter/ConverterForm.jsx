import React, { useContext, useEffect, useState } from "react";
import { ConverterContext } from "../../context/ConverterContext";
import { useFetchCurrencyData } from "../../hooks/useFetchCurrencyData";
import CurrencyList from "./CurrencyList";

function ConverterForm() {
    const [endpoint, setEndpoint] = useState(null);
    const { data, pairResult } = useFetchCurrencyData("codes", endpoint);
    const { from, to, ConvertAmount } = useContext(ConverterContext);
    const [selectedCurrencyFrom, setSelectedCurrencyFrom] = from;
    const [selectedCurrencyTo, setSelectedCurrencyTo] = to;
    const [amount, setAmount] = ConvertAmount;
    const [conversionResult, setConversionResult] = useState(null);
    const [resultAmount, setResultAmount] = useState(null);

    function handleChangeAmount(e) {
        setAmount(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        setEndpoint(`${selectedCurrencyFrom}/${selectedCurrencyTo}/${amount}`);
        setResultAmount(amount);
    }

    useEffect(() => {
        if (pairResult) {
            const {
                base_code,
                target_code,
                conversion_rate,
                conversion_result,
                time_last_update_utc,
            } = pairResult;
            setConversionResult({
                from: base_code,
                to: target_code,
                conversion_rate,
                conversion_result,
                last_updated: time_last_update_utc,
            });
        }
    }, [pairResult]);
    if (conversionResult) console.log("conversionResult", conversionResult);
    return (
        <form onSubmit={handleSubmit} className='exchange-form'>
            <div className='convert-options'>
                <div className='amount'>
                    <label htmlFor='amount'> Amount </label>
                    <br />
                    <input
                        type='number'
                        value={amount}
                        onChange={handleChangeAmount}
                        className='field'
                    />
                </div>
                <CurrencyList
                    label='from'
                    selectedCurrency={selectedCurrencyFrom}
                    setSelectedCurrency={setSelectedCurrencyFrom}
                    data={data}
                />
                <div className='switch-btn'>
                    <i class='bi bi-arrow-left-right'></i>
                </div>

                <CurrencyList
                    label='to'
                    selectedCurrency={selectedCurrencyTo}
                    setSelectedCurrency={setSelectedCurrencyTo}
                    data={data}
                />
            </div>
            <div className='get-convert-result'>
                <div className='convert-result'>
                    {pairResult && conversionResult ? (
                        <div>
                            <p>
                                conversion rate 1 {conversionResult.from} ={" "}
                                {conversionResult.conversion_rate}{" "}
                                {conversionResult.to}
                            </p>
                            <p>
                                {resultAmount} {conversionResult.from} ={" "}
                                {conversionResult.conversion_result}{" "}
                                {conversionResult.to}
                            </p>
                            <p>
                                Last updated:{" "}
                                {conversionResult.last_updated.substring(0, 26)}
                            </p>
                        </div>
                    ) : (
                        <div>
                            <p>
                                choose the amount and choose your pair to get
                                the result
                            </p>
                        </div>
                    )}
                </div>
                <button
                    type='submit'
                    className='filled-btn'
                    disabled={amount > 0 ? false : true}>
                    Convert
                </button>
            </div>
        </form>
    );
}

export default ConverterForm;
