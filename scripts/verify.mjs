import assert from 'node:assert';
import { formatMinutesSeconds, formatTotalElapsed } from '../src/utils/timeFormat.ts';
import { DEFAULT_PRESETS } from '../src/data/defaultPresets.ts';

console.log('--- Iniciando Verificação Automatizada do BJJ Timer ---');

// 1. Testes de formatação de tempo
console.log('1. Testando formatMinutesSeconds...');
assert.strictEqual(formatMinutesSeconds(0), '00:00');
assert.strictEqual(formatMinutesSeconds(5), '00:05');
assert.strictEqual(formatMinutesSeconds(65), '01:05');
assert.strictEqual(formatMinutesSeconds(360), '06:00');
assert.strictEqual(formatMinutesSeconds(600), '10:00');
console.log('✓ formatMinutesSeconds passou!');

console.log('2. Testando formatTotalElapsed...');
assert.strictEqual(formatTotalElapsed(0), '00:00');
assert.strictEqual(formatTotalElapsed(125), '02:05');
assert.strictEqual(formatTotalElapsed(3600), '1h 00m');
assert.strictEqual(formatTotalElapsed(3665), '1h 01m');
console.log('✓ formatTotalElapsed passou!');

// 3. Teste dos Presets de BJJ
console.log('3. Validando presets padrão de Jiu-Jitsu...');
assert.ok(DEFAULT_PRESETS.length >= 6, 'Deve haver ao menos 6 presets');

const categories = new Set(DEFAULT_PRESETS.map(p => p.category));
assert.ok(categories.has('adulto'), 'Deve conter categoria adulto');
assert.ok(categories.has('competicao'), 'Deve conter categoria competicao');
assert.ok(categories.has('kids'), 'Deve conter categoria kids');
assert.ok(categories.has('drills'), 'Deve conter categoria drills');
assert.ok(categories.has('condicionamento'), 'Deve conter categoria condicionamento');

DEFAULT_PRESETS.forEach(preset => {
  assert.ok(preset.id && preset.name && preset.description, `Preset ${preset.id} deve ter id, name e description`);
  assert.ok(preset.config.rollTime > 0, `Preset ${preset.name} deve ter rollTime > 0`);
  assert.ok(preset.config.restTime >= 0, `Preset ${preset.name} deve ter restTime >= 0`);
  assert.ok(preset.config.warningTime > 0, `Preset ${preset.name} deve ter warningTime > 0`);
});
console.log(`✓ Todos os ${DEFAULT_PRESETS.length} presets validados com sucesso!`);

console.log('--- Todos os testes passaram com sucesso! ---');

