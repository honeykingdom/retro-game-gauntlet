/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs').promises;

// prettier-ignore
const platforms = [
  { id: 'dos',                  name: 'DOS',                       releaseDate: 'August 1981',        file: 'list_dos.dat' },
  { id: 'zx-spectrum',          name: 'ZX Spectrum',               releaseDate: 'April 23, 1982',     file: 'list_zx.dat' },
  { id: 'commodore-64',         name: 'Commodore 64',              releaseDate: 'August 1982',        file: 'list_c64.dat' },
  { id: 'nec-pc-98',            name: 'NEC PC-98',                 releaseDate: 'October 1982',       file: 'list_pc98.dat' },
  { id: 'msx',                  name: 'MSX',                       releaseDate: 'June 27, 1983',      file: 'list_msx.dat', encoding: 'utf16le' },
  { id: 'msx2',                 name: 'MSX2',                      releaseDate: '1985',               file: 'list_msx2.dat' },
  { id: 'nes',                  name: 'Famicom / NES',             releaseDate: 'July 15, 1983',      file: 'list_nes.dat' },
  { id: 'sega-master-system',   name: 'Sega Master System',        releaseDate: 'October 20, 1985',   file: 'list_sms.dat' },
  { id: 'commodore-amiga',      name: 'Commodore Amiga',           releaseDate: 'July 23, 1985',      file: 'list_amg.dat' },
  { id: 'turbografx-16',        name: 'TurboGrafx-16',             releaseDate: 'October 30, 1987',   file: 'list_tg16.dat' },
  { id: 'sega-genesis',         name: 'Sega Genesis / Mega Drive', releaseDate: 'October 29, 1988',   file: 'list_smd.dat' },
  { id: 'game-boy',             name: 'Game Boy / Game Boy Color', releaseDate: 'April 21, 1989',     file: 'list_gb.dat' },
  { id: 'game-gear',            name: 'Game Gear',                 releaseDate: 'October 6, 1990',    file: 'list_gg.dat' },
  { id: 'snes',                 name: 'Super Famicom / SNES',      releaseDate: 'November 21, 1990',  file: 'list_snes.dat' },
  { id: 'neo-geo',              name: 'Neo Geo',                   releaseDate: 'April 26, 1990',     file: 'list_ngo.dat' },
  { id: 'panasonic-3do',        name: 'Panasonic 3DO',             releaseDate: 'October 4, 1993',    file: 'list_3do.dat' },
  { id: 'sega-saturn',          name: 'Sega Saturn',               releaseDate: 'November 22, 1994',  file: 'list_ss.dat' },
  { id: 'playstation',          name: 'PlayStation',               releaseDate: 'December 3, 1994',   file: 'list_psx.dat' },
  { id: 'nintendo-64',          name: 'Nintendo 64',               releaseDate: 'June 23, 1996',      file: 'list_n64.dat' },
  { id: 'neo-geo-pocket',       name: 'Neo Geo Pocket',            releaseDate: 'October 28, 1998',   file: 'list_ngp.dat' },
  { id: 'dreamcast',            name: 'Dreamcast',                 releaseDate: 'November 27, 1998',  file: 'list_dc.dat' },
  { id: 'wonderswan',           name: 'WonderSwan',                releaseDate: 'March 4, 1999',      file: 'list_ws.dat' },
  { id: 'playstation-2',        name: 'PlayStation 2',             releaseDate: 'March 4, 2000',      file: 'list_ps2.dat' },
  { id: 'game-boy-advance',     name: 'Game Boy Advance',          releaseDate: 'March 21, 2001',     file: 'list_gba.dat' },
  { id: 'gamecube',             name: 'GameCube',                  releaseDate: 'September 14, 2001', file: 'list_gc.dat' },
  { id: 'nintendo-ds',          name: 'Nintendo DS',               releaseDate: 'November 21, 2004',  file: 'list_ds.dat' },
  { id: 'playstation-portable', name: 'PlayStation Portable',      releaseDate: 'December 12, 2004',  file: 'list_psp.dat' },
  { id: 'wii',                  name: 'Wii',                       releaseDate: 'November 19, 2006',  file: 'list_wii.dat' },
]

// prettier-ignore
const normalizeMap = {
  // dos
  'B.A.T. II ŃŠŠ£ The Koshan Conspiracy':                            'B.A.T. II – The Koshan Conspiracy',
  'Die Hāā¢hlenwelt Saga: Der Leuchtende Kristall':                 'Die Höhlenwelt Saga: Der Leuchtende Kristall',
  'Fernando MartāŠ½n Basket Master':                                 'Fernando Martín Basket Master',
  'Haral HāŠµrdtand: Kampen om de rene tāŠ¶nder':                 'Haral Hårdtand: Kampen om de rene tænder',
  'āāstanbul Efsaneleri: Lale Savaā¼ŠÆāŠ·āālarāā': 'İstanbul Efsaneleri: Lale Savaşçıları',
  'James Clavell\'s Shā¼Šgun':                                       'James Clavell\'s Shōgun',
  'La AbadāŠ½a del Crimen':                                          'La Abadía del Crimen',
  'La Corona MāŠ±gica':                                              'La Corona Mágica',
  'Math Blaster 2 (Matteraketen: Den fāā¢rsvunna staden)':          'Math Blaster 2 (Matteraketen: Den försvunna staden)',
  'Money Bags: Beat the Gnome of Zāārich':                         'Money Bags: Beat the Gnome of Zürich',
  'Mortadelo y Filemāān II':                                       'Mortadelo y Filemón II',
  'Mundial de Fāātbol':                                            'Mundial de Fútbol',
  'PC Fāātbol 4.0':                                                'PC Fútbol 4.0',
  'PC Fāātbol 5.0':                                                'PC Fútbol 5.0',
  'PC Selecciāān Espaāāola de Fāātbol Eurocopa \'96':   'PC Selección Española de Fútbol Eurocopa \'96',
  'Phantasie IIIā¬Š°: The Wrath of Nikademus':                         'Phantasie III : The Wrath of Nikademus',
  'Simulador Profesional de Fāātbol':                              'Simulador Profesional de Fútbol',
  'TouchāŠ¹: The Adventures of the Fifth Musketeer':                  'Touché: The Adventures of the Fifth Musketeer',

  // other
  'Aknakeres”':                'Aknakereső',
  'Jagten P† Bubbers Badekar': 'Jagten På Bubbers Badekar',
  'Seer„uber':                 'Seeräuber'
};

const normalizeGame = (name) => {
  const nameTrim = name.trim();
  const newName = normalizeMap[nameTrim] || nameTrim;

  // replace '�' character
  return newName.replace(/\uFFFD/g, ' ').trim();
};

const main = async () => {
  console.time('Normalize Data');

  const lists = await Promise.all(
    platforms.map(({ file, encoding }) =>
      fs.readFile(path.join('src/data/original', file), encoding || 'utf8'),
    ),
  );

  const data = platforms.reduce(
    (acc, { id }, index) => ({
      ...acc,
      [id]: lists[index]
        .trim()
        .split('\n')
        .map(normalizeGame),
    }),
    {},
  );

  // await Promise.all(
  //   platforms.map(({ id }) => {
  //     return fs.writeFile(
  //       path.join('src/data/result', `${id}.json`),
  //       JSON.stringify(data[id], null, 2),
  //     );
  //   }),
  // );

  const normalizedPlatforms = platforms.map(
    ({ file, encoding, id, ...rest }) => ({
      ...rest,
      id,
      gamesCount: data[id].length,
    }),
  );

  await Promise.all([
    fs.writeFile(
      path.join('src/data/games.json'),
      JSON.stringify(data, null, 2),
    ),
    fs.writeFile(
      path.join('src/data/platforms.json'),
      JSON.stringify(normalizedPlatforms, null, 2),
    ),
  ]);

  console.timeEnd('Normalize Data');
};

main();
