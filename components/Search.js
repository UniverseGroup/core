import FormControl from "@mui/material/FormControl";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import {FaSearch} from 'react-icons/fa';
import {useState, useRef} from 'react';
import useOutsideClick from "../utils/useOutsideClick";
import Link from 'next/link';
import Image from 'next/image';

const SearchBar = () => {
    const ref = useRef();
    const [search, setSearch] = useState('');
    const [focus, setFocus] = useState(false);
    const [data, setData] = useState(undefined);
    const [isloading, setIsloading] = useState(false);
    useOutsideClick(ref, () => {
        setFocus(false);
    });
    const Search = async (value) => {
        setIsloading(true);
        const data = await fetch('/api/search?q=' + value, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json = await data.json();
        setIsloading(false);
        if (json.length === 0) {
            return setData(undefined);
        }
        setData(json);
        console.log(json.length);
    }
    return (
        <>
            <FormControl sx={{m: 1, width: '100%'}} variant="outlined" onFocus={() => setFocus(true)} ref={ref}>
                <OutlinedInput
                    autoComplete='off'
                    id="outlined-adornment-password"
                    type='text'
                    placeholder='이곳에 검색하고싶은 봇 또는 서버를 입력하세요'
                    sx={{height: '4em'}}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        Search(e.target.value);
                    }}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="search"
                                edge="end"
                                onClick={() => {
                                    window.location.href = `/search?q=${search}`;
                                }}
                            >
                                <FaSearch/>
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
            <div style={{
                display: focus ? 'block' : 'none',
                width: '93em',
                border: 'solid 1px #467af1',
                borderRadius: '15px',
                position: 'absolute',
                zIndex: 50,
                backgroundColor: 'white',
            }}>
                <ul style={{padding: 0, height: '20em', overflowY: 'scroll'}}>
                    {
                        isloading ? (
                            '검색중입니다...'
                        ) : (
                            data !== undefined ? (
                                data.map((item, index) => {
                                    return (
                                        <div className='searchresult' key={index} style={{
                                            marginBottom: '1em',
                                            borderBottom: 'solid 1px gray',
                                            cursor: 'pointer'
                                        }}>
                                            <Link passHref href={`/bots/${item.botid}`}>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                                        <Image alt={item.botname}
                                                               src={'/api/imageproxy?url=' + encodeURIComponent(item.botavatar)}
                                                               width={50} height={50}/>
                                                        <span
                                                            style={{marginLeft: '0.5em'}}>{item.botname}<br/>{item.slug}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )
                                })
                            ) : (
                                search === '' ? (
                                    '검색어를 입력해주세요'
                                ) : (
                                    '검색 결과가 없습니다'
                                )
                            )
                        )

                    }
                </ul>
            </div>
        </>

    )
}

export default SearchBar
