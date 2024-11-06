#include <stdio.h>
#include <stdbool.h>
#include <sys/stat.h>
#include <string.h>
#include <errno.h>
#include "quickjs-utils.h"
#include "quickjs-print.h"
#include "quickjs-modulesys.h"
#include "quickjs-full-init.h"

extern const unsigned char yavascript_bytecode[];
extern const unsigned int yavascript_bytecode_len;

static JSContext *JS_NewCustomContext(JSRuntime *rt)
{
  JSContext *ctx = JS_NewContextRaw(rt);
  if (!ctx)
    return NULL;
  JS_AddIntrinsicBaseObjects(ctx);
  JS_AddIntrinsicDate(ctx);
  JS_AddIntrinsicEval(ctx);
  JS_AddIntrinsicStringNormalize(ctx);
  JS_AddIntrinsicRegExp(ctx);
  JS_AddIntrinsicJSON(ctx);
  JS_AddIntrinsicProxy(ctx);
  JS_AddIntrinsicMapSet(ctx);
  JS_AddIntrinsicTypedArrays(ctx);
  JS_AddIntrinsicPromise(ctx);
  JS_AddIntrinsicBigInt(ctx);
  JS_AddIntrinsicBigFloat(ctx);
  JS_AddIntrinsicBigDecimal(ctx);
  JS_AddIntrinsicOperators(ctx);
  JS_EnableBignumExt(ctx, true);

  if (quickjs_full_init(ctx)) {
    exit(1);
  }

  return ctx;
}

int main(int argc, char **argv)
{
  JSRuntime *rt;
  JSContext *ctx;
  int exit_status;

  rt = JS_NewRuntime();
  js_std_set_worker_new_context_func(JS_NewCustomContext);
  js_std_init_handlers(rt);
  JS_SetMaxStackSize(rt, 8000000);
  QJMS_InitState(rt);
  JS_SetCanBlock(rt, true);
  ctx = JS_NewCustomContext(rt);
  js_std_add_helpers(ctx, argc, argv);
  QJMS_InitContext(ctx);

  QJMS_EvalBinary(ctx, yavascript_bytecode, yavascript_bytecode_len, 0);

  exit_status = js_std_loop(ctx);

  QJMS_FreeState(rt);
  JS_FreeContext(ctx);
  js_std_free_handlers(rt);
  JS_FreeRuntime(rt);

  return exit_status;
}
