import 'website/justfile'

cli_filename := "./lib/scripts/@walle/cli.sh"

# Setup the project
setup:
    just yarn install

walle *args:
    {{cli_filename}} {{args}}

walle-update *args:
    curl -fsSL https://raw.githubusercontent.com/FabrizioCafolla/walle-design-system/main/walle.sh -o {{cli_filename}}
    chmod +x {{cli_filename}}
    just walle update {{args}}
