import {TextField} from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import {EmojiEmotions} from "@mui/icons-material";
import dynamic from "next/dynamic";
import 'emoji-mart/css/emoji-mart.css'
const Picker = dynamic(
    () => import("emoji-mart"),
);


