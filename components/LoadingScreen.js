import {CircularProgress} from "@mui/material";

export default function LoadingScreen(){
    return(
        <>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
                <CircularProgress style={{margin:'auto'}}/>
            </div>
        </>
    )
}
