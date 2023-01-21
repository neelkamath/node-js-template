import { SemanticAttributes } from '@opentelemetry/semantic-conventions';
import { Span, trace } from '@opentelemetry/api';

export type SpanBuilder = {
  /** {@link SemanticAttributes.CODE_FUNCTION} (`undefined` if this is a top-level callback.) */
  readonly fn?: string;
  /** {@link SemanticAttributes.CODE_NAMESPACE} (`undefined` if this is a top-level {@link fn}.) */
  readonly ns?: string;
  /** {@link SemanticAttributes.CODE_FILEPATH} */
  readonly path: string;
};

export type TraceBuilder = {
  readonly traceName: string;
  readonly spanName: string;
};

/**
 * Executes the callback, `cb`, and ends the span afterwards.
 *
 * @example
 * ```
 * class MyClass {
 *   async function myFn(): Promise<number> {
 *     return await withSpan(
 *       { traceName: 'my-tracer', spanName: 'my-span' },
 *       { fn: this.myFn.name, ns: MyClass.name, path: __filename },
 *       async (span) => {
 *         try {
 *           return await compute();
 *         } catch (err) {
 *           span.recordException(err);
 *           span.setStatus({ code: SpanStatusCode.ERROR, message: "Couldn't compute." });
 *         }
 *       },
 *     );
 *   };
 * }
 * ```
 */
export default function withSpan<T>(
  { traceName, spanName }: TraceBuilder,
  { fn, ns, path }: SpanBuilder,
  cb: (span: Span) => T,
): T {
  return trace.getTracer(traceName).startActiveSpan(
    spanName,
    {
      attributes: {
        [SemanticAttributes.CODE_FUNCTION]: fn,
        [SemanticAttributes.CODE_NAMESPACE]: ns,
        [SemanticAttributes.CODE_FILEPATH]: path,
      },
    },
    (span) => {
      try {
        return cb(span);
      } finally {
        span.end();
      }
    },
  );
}
