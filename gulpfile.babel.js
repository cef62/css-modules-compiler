import gulp         from 'gulp'
import sequence     from 'run-sequence'
import del          from 'del'
import concat       from 'gulp-concat'
import rename       from 'gulp-rename'
import replace      from 'gulp-replace'
import tap          from 'gulp-tap'
import postcss      from 'gulp-postcss'
import atImport     from 'postcss-import'
import modules      from 'postcss-modules'
import cssnano      from 'cssnano'
import discardEmpty from 'postcss-discard-empty'
import discardDuplicates from 'postcss-discard-duplicates'
import path         from 'path'
import fs           from 'fs'

import { log, colors } from 'gulp-util'

let currentFilePath
const mappedFiles = new Map()

const updateCurrentFile = (file) => {
  currentFilePath = file.path
}

const getJSONFromCssModules = (cssFileName, json) => {
  // log(colors.magenta(cssFileName))
  // log(json)
  const cssName       = path.basename(cssFileName, '.css')
  const targetFolder  = path.dirname(cssFileName)
  const jsonFileName  = path.resolve(targetFolder, `${cssName}.css.json`)
  fs.writeFileSync(jsonFileName, JSON.stringify(json))

  // store the mapped css
  mappedFiles.set(cssFileName, json)
}

const findImportLine = /^(\s{0,})(import)(\s{0,})(\w{1,})(\s{0,})(from)(\s{0,})(\'|\"|\`)((\.{1}\/){0,1}|(\.{1,2}\/){0,})(\w{1,})(\.css)(\'|\"|\`)(?=\s{0,}$)/gm
const getImportToken = /^(import)(\s{0,})/
const getFirstWord = /^.*?(?=\s)/
const removeUntilQuote = /^.*?(\'|\"|\`)/
const removeClosingQuote = /(\'|\"|\`).{0,}$/

const replaceImport = (match, ...tokens) => {
  log(currentFilePath)
  
  // clear extra outer spaces
  let tmp = match.trim()

  // remove the import token
  tmp = tmp.replace(getImportToken, '')

  // get the import name
  let varName = getFirstWord.exec(tmp)

  // TODO: should throws?
  if (!varName) { return }

  // store the import name
  varName = varName[0]
  
  // retrieve the imported name
  tmp = tmp.replace(removeUntilQuote, '')
  tmp = tmp.replace(removeClosingQuote, '')

  // get the current folder for the file
  const currentFolder  = path.dirname(currentFilePath)

  // resolve the import statement and the current folder
  // TODO: add condition to resolve css imported from node_modules
  const importPath = path.resolve(currentFolder, tmp)

  // get the cssmodules map generated
  const json = mappedFiles.get(importPath)

  // TODO: shouldn't be possible to not have a match... should throws?
  if (!json) {
    return match
  }

  // TODO: should cleanup th eoutput removing unnecessaty quotes
  // and replacing double-quotes to single-quotes
  return `\nconst ${varName} = ${JSON.stringify(json, undefined, 2)}`
}

gulp.task('css', () => {
  return gulp.src('./build/**/*.css')
    .pipe(postcss([
      modules({ getJSON: getJSONFromCssModules }),
    ]))
    .pipe(gulp.dest('./build'))
})

gulp.task('merge', () => {
  return gulp.src('./build/**/*.css')
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('./build'))
})

gulp.task('optimize', () => {
  return gulp.src('./build/styles.css')
    .pipe(postcss([
      discardEmpty(),
      discardDuplicates()
    ]))
    .pipe(gulp.dest('./build'))
})

gulp.task('replace', () => {
  return gulp.src('./build/**/*.js')
    .pipe(tap(updateCurrentFile))
    .pipe(replace(findImportLine, replaceImport))
    .pipe(gulp.dest('./build'))
})

gulp.task('clean-temporary', () => {
  return del([
    './build/**/*.css',
    './build/**/*.css.json',
    '!./build/styles.css',
  ])
})


gulp.task('copy', () => {
  return gulp.src('./app/**/*')
    .pipe(gulp.dest('./build'))
})

gulp.task('clean', () => {
  return del([
    'build',
  ])
})


gulp.task('default', (cb) => {
  mappedFiles.clear()

  sequence(
    'clean',
    'copy',
    'css',
    'merge',
    'optimize',
    'replace',
    'clean-temporary',
    cb
  )
})
