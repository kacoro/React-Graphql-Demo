import {InputHTMLAttributes} from 'react'
import { FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react';
import React from 'react'
import {Formik,Form,Field,useField} from 'formik'


type InputFieldProps = InputHTMLAttributes<HTMLInputElement> &{
    name:string;
    label:string;
};

 const InputField: React.FC<InputFieldProps> = ({label,size: _,...props}) =>{
        const [field,{error}] = useField(props);
        return (
            <FormControl isInvalid={!!error}>
                <FormLabel htmlFor="username">{label}</FormLabel>
                <Input {...field} id={field.name} {...props} />
                { error ?<FormErrorMessage>{error}</FormErrorMessage>:null}
              </FormControl>
        );
}
export default InputField;