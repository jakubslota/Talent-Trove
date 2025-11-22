import React from 'react';
import {Paper, Tab, Tabs} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import RegisterWorker from "./RegisterWorker";
import RegisterRecruiter from "./RegisterRecruiter";

function IndexRegister() {

    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    }
    interface TabPanelProps {
        children?: React.ReactNode;
        dir?: string;
        index: number;
        value: number;
    }
    function TabPanel(props: TabPanelProps) {
        const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
    return (
        <Paper elevation={10} style={styles.paperStyle}>
        <Tabs
            value={value}
            indicatorColor="secondary"
            textColor="secondary"
            onChange={handleChange}
            variant={"fullWidth"}
        >
            <Tab label="Pracownik" />
            <Tab label="Rekruter" />
        </Tabs>
            <TabPanel value={value} index={0}>
          <RegisterWorker/>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <RegisterRecruiter/>
        </TabPanel>
        </Paper>
    );
}

export default IndexRegister;

 const styles = {
     paperStyle: {
            width: 400,
            margin: "30px auto",
     }
 }