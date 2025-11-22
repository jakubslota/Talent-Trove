import React, {useEffect, useRef, useState} from 'react';
import {useAuthUser,useAuthHeader} from 'react-auth-kit';
import axios from "axios";
import {Button, FormControl, InputLabel, MenuItem, Select, Step, StepLabel, Stepper, Typography,} from '@mui/material';
import {SelectChangeEvent} from '@mui/material/Select';
import {message} from "antd";

interface Progress {
  [key: string]: string;
}
interface ProgrammingLanguages {
    id: number;
    name: string;
    }
interface ProgrammingLanguage {
    worker: number;
    programming_languages: number;
    advanced: string;
}

const AddWorkerProgrammingLanguages: React.FC = () => {
  const user = useAuthUser();  
  const authHeader = useAuthHeader();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [progress, setProgress] = useState<Progress>({});
  const [programingLanguagesList, setProgramingLanguagesList] = useState<ProgrammingLanguages[]>([]);
  const [programingLanguages, setProgramingLanguages] = useState<ProgrammingLanguage[]>([]);


  const getProgramingLanguages = async () => {
    try {
        const response = await axios.get('http://localhost:8000/api/programming-languages/',{ headers: { 'Authorization': authHeader() }});
        setProgramingLanguagesList(response.data);
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            
        } else {
            
        }
    }
}; 

const handleShowResults = () => {
    const workerProgrammingLanguages = selectedLanguages.map(language => {
        const selectedLanguage = programingLanguagesList.find(lang => lang.name === language);

        if (!selectedLanguage) {
            console.error(`Nie znaleziono: ${language}`);
            return null; // or handle the error appropriately
        }

        return {
            worker: user()?.user_role_id,
            programming_languages: selectedLanguage.id,
            advanced: progress[language] || 'N/A'
        };
    }).filter(Boolean) as ProgrammingLanguage[];

    // Update the programingLanguages state
    setProgramingLanguages(workerProgrammingLanguages);

};

const addWorkerProgramingLanguages = async () => {
    try {
        
        const response = await axios.post(`http://localhost:8000/api/programming-languages/workers/${user()?.user_role_id}/`,programingLanguages,{ headers: { 'Authorization': authHeader() }});
        message.success("Pomyślnie dodano języki programowania!", 2)

    } catch (error: any) {
            if (error.response !== undefined) {
                for (let [key, value] of Object.entries(error.response.data)) {
                        message.error(`${value}`, 4);
                }
            }
    }
}; 
const shouldLog = useRef(true);
    useEffect(() => {
        if (shouldLog.current) {
            shouldLog.current = false;
            getProgramingLanguages();
        }
        }, []);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if (activeStep === 1) {
        handleShowResults();
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleLanguageSelect = (event: SelectChangeEvent<string[]>) => {
    setSelectedLanguages(Array.isArray(event.target.value) ? event.target.value : [event.target.value]);
  };

  
  const handleProgressChange = (language: string, value: string) => {
    setProgress((prevProgress) => ({
      ...prevProgress,
      [language]: value,
    }));
  };

//   const handleShowResults = () => {
    
//     
//   };



  return (
    <div style={ {marginTop: 30, width: '100%'}}>
      <Stepper activeStep={activeStep} alternativeLabel>
        <Step key="SelectLanguages">
          <StepLabel>Wybierz języki</StepLabel>
        </Step>
        <Step key="AssignProgress">
          <StepLabel>Przypisz zaawansowanie</StepLabel>
        </Step>
        <Step key="ShowResults">
          <StepLabel>Pokaż wyniki</StepLabel>
        </Step>
      </Stepper>
      <div style={styles.div}>
        {activeStep === 0 && (
          <div>
            <FormControl fullWidth>
              <InputLabel>Wybierz języki</InputLabel>
              <Select
                multiple
                value={selectedLanguages}
                onChange={handleLanguageSelect}
                label="Wybierz języki"
                renderValue={(selected) => (selected as string[]).join(', ')}
              >
                {/* Dodaj tutaj swoje języki programowania */}
                {programingLanguagesList.map((language) => (
                  <MenuItem key={language.id} value={language.name}>
                    {language.name}
                  </MenuItem>
                ))}
                
                {/* itd. */}
              </Select>
            </FormControl>
            
            <div style={styles.div}>
              <Button variant="contained" color="primary" onClick={handleNext}>
                Dalej
              </Button>
            </div>
          </div>
        )}
        {activeStep === 1 && (
          <div>
            {selectedLanguages.map((language) => (
              <div style={styles.div} key={language}>
                <Typography style={{marginTop: 10,
        marginBottom: 10}}>{language}</Typography>
                <FormControl fullWidth sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-select-small-label">Wybierz zaawansowanie</InputLabel>
                        <Select
                            labelId="demo-select-large-label"
                            id="demo-select-small"
                            value={progress[language] || ''}
                            label="Wybierz zaawansowanie"
                            onChange={(event) => handleProgressChange(language, event.target.value as string)}
                        >
                
                    <MenuItem value="beginner">Początkujący</MenuItem>
                    <MenuItem value="intermediate">Średniozaawansowany</MenuItem>
                    <MenuItem value="advanced">Zaawansowany</MenuItem>
                  </Select>
                </FormControl>
              </div>
            ))}
            <div>
              <Button onClick={handleBack}>Wróć</Button>
              <Button variant="contained" color="primary" onClick={handleNext}>
                Dalej
              </Button>
            </div>
          </div>
        )}
        {activeStep === 2 && (
          <div>
            <Typography paddingTop={2} paddingBottom={2}>Wybrane języki i zaawansowanie:</Typography>
            {selectedLanguages.map((language) => (
              <Typography paddingBottom={2} key={language}>{`${language}: ${progress[language] === "beginner" ? "Początkujący" : (progress[language] === "intermediate" ? "Średniozaawansowany" : (progress[language] === "advanced" ? "Zaawansowany" : progress[language]))}`}</Typography>
            ))}
            <div>
              <Button onClick={handleBack}>Wróć</Button>
              <Button variant="contained" color="primary" onClick={addWorkerProgramingLanguages}>
                Zapisz
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddWorkerProgrammingLanguages;

const styles = {
    div: {
        marginTop: 20,
        marginBottom: 20,
    }
}