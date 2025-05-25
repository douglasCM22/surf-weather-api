import * as path from 'path';
import moduleAlias from 'module-alias';

const files = path.resolve(__dirname, '../..', 'files');

moduleAlias.addAliases({
    '@src': path.join(files, 'src'),
    '@tests': path.join(files, 'tests'),
});
