#!/usr/bin/env node

import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';

clear();
console.log(
    chalk.red(
        figlet.textSync('sockbasher', {horizontalLayout: 'full'})
    )
)

