import * as shell from "shelljs";

shell.mkdir("-p", "o-dist/client");
shell.mkdir("-p", "o-dist/db");
shell.cp("-r", "src/client/", "dist/");
shell.cp("-r", "src/client/", "o-dist/");
