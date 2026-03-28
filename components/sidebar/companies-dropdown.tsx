import {Text} from '@nextui-org/react';
import React from 'react';
import {Box} from '../styles/box';
import {Flex} from '../styles/flex';

export const CompaniesDropdown = () => {
   return (
      <Box>
         <Flex align={'center'} css={{gap: '$7'}}>
            <Box css={{ bg: '#7047EB', minWidth: '36px', width: '36px', height: '36px', borderRadius: '$md', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '$white', fontWeight: '$bold', fontSize: '$lg' }}>
               A
            </Box>
            <Box>
               <Text
                  h3
                  size={'$lg'}
                  weight={'medium'}
                  css={{
                     margin: 0,
                     color: '#111827',
                     lineHeight: '$lg',
                  }}
               >
                  Admin Panel
               </Text>
            </Box>
         </Flex>
      </Box>
   );
};
