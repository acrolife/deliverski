let g:syntastic_javascript_checkers=['eslint']
let g:syntastic_javascript_eslint_generic = 1
let g:syntastic_javascript_eslint_exec = '/bin/ls'
let g:syntastic_javascript_eslint_exe='source "$HOME/.nvm/nvm.sh"; source "$HOME/.nvm/bash_completion"; nvm use; $(npm bin)/eslint'
let g:syntastic_javascript_eslint_args='-f compact'

