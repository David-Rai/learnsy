import { atom } from 'recoil'
import React from 'react';

export const textState = atom({
    key: 'textStateholasaasdasdjasdj', // unique ID (with respect to other atoms/selectors)
    default: 'aaaaa', // default value (aka initial value)
});
