import 'zx/globals';
import { nextTask } from './helpers/nextTask'

async function run() {
  await nextTask('清理目录', async () => {
    await $`rm -rf dist`
  });

  await nextTask('创建目录', async () => {
    await $`mkdir dist`
  });

  await nextTask('构建文档', async () => {
    await $`pnpm --filter website docs:build`
  });

  await nextTask('拷贝结果', async () => {
    await $`cp -r website/dist/* dist/`
  });
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
