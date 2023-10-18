/*
 * Created by IntelliJ IDEA.
 * User: kavin
 * Date: Mon Jul 13 2020
 * Time: 23:43
 */
// Generic reusable hook
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import {useState} from 'react';
import useConstant from 'use-constant';
import {useAsync} from 'react-async-hook';

export const useDebouncedSearch = (searchFunction, wait) => {
  // Handle the input text state
  const [inputText, setInputText] = useState('');

  // Debounce the original search async function
  const debouncedSearchFunction = useConstant(() =>
    AwesomeDebouncePromise(searchFunction, wait),
  );

  // The async callback is run each time the text changes,
  // but as the search function is debounced, it does not
  // fire a new request on each keystroke
  const searchResults = useAsync(async () => {
    // if (inputText.length === 0) {
    //     return [];
    // } else {
    return debouncedSearchFunction(inputText);
    // }
  }, [debouncedSearchFunction, inputText]);

  // Return everything needed for the hook consumer
  return {
    inputText,
    setInputText,
    searchResults,
  };
};
