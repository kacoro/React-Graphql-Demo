import {InputHTMLAttributes} from 'react'
import { FormControl, FormLabel, Input, FormErrorMessage, Textarea} from '@chakra-ui/core';
import React from 'react'
import {useField} from 'formik'


type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    name: string;
    textarea?: boolean;
  };


 const InputField: React.FC<InputFieldProps> = ({label,textarea,size: _,...props}) =>{
         let InputOrTextare = Input;
         if(textarea){
             InputOrTextare = Textarea 
         }
        const [field,{error}] = useField(props);
        return (
            <FormControl isInvalid={!!error}>
                <FormLabel htmlFor="username">{label}</FormLabel>
                <InputOrTextare {...field} id={field.name} {...props} />
                { error ?<FormErrorMessage>{error}</FormErrorMessage>:null}
              </FormControl>
        );
}
export default InputField;