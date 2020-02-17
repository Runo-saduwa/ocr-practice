import React, { useEffect, useState } from 'react';
import { createWorker } from 'tesseract.js';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import './App.css';

function App() {
  const [ ocr, setOcr ] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const updateProgressAndLog = (m) => {

    // Maximum value out of which percentage needs to be
    // calculated. In our case it's 0 for 0 % and 1 for Max 100%
    // DECIMAL_COUNT specifies no of floating decimal points in our
    // Percentage
    var MAX_PARCENTAGE = 1 ;

    if(m.status === "recognizing text"){
        var pctg = (m.progress / MAX_PARCENTAGE) * 100;
        setPercentage(pctg.toFixed(2));
        console.log(pctg.toFixed(2));
        // this.setState({
        //     pctg : pctg.toFixed(DECIMAL_COUNT)
        // })

    }
}
	const worker = createWorker({
		logger: (m) => updateProgressAndLog(m)
	});
	const doOCR = async (filepath) => {
    setIsProcessing(true);
		await worker.load();
		await worker.loadLanguage('eng');
		await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(filepath);
    setIsProcessing(false);
    setOcr(text);
    
	};

	const onChange = (file) => {
		doOCR(file);
	};
  
 
	return (
		<div className="App">
			<label>
				{/* Click to select some files... */}
				<input
					// style={{ display: "none" }}
					type="file"
					onChange={(e) => {
						onChange(e.target.files[0]);
					}}
				/>
			</label>

			{/* <FilePond 
                                onaddfile={(err,file) =>{
                         
                                     doOCR(file);

                                }}
                                onremovefile={(err,file) =>{
                                    setOcr("")
                                }}
                                /> */}
			{isProcessing ? `Processing: ${percentage}%` : <p>{ocr}</p>}
		</div>
	);
}

export default App;
