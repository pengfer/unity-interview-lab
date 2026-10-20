#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
把 data/*.json 合并成 assets/bank.js，并做严格的题库校验。

用法：
    python scripts/build_bank.py

规则：
  - 每个 data/<cat>.json 是一个题目数组，cat 字段必须等于文件名
  - id 全局唯一
  - single: answer 恰好 1 个下标；multi: >=2 个；judge: options 固定 ["正确","错误"]
  - answer 里所有下标必须落在 options 范围内
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(ROOT, 'data')
OUT = os.path.join(ROOT, 'assets', 'bank.js')

# 输出顺序 = 分类展示顺序
ORDER = ['cs', 'engine', 'physics', 'render', 'anim', 'ui', 'perf', 'asset', 'net', 'arch', 'math']
LEVELS = {'基础', '进阶', '高级'}
TYPES = {'single', 'multi', 'judge'}

errors = []
warnings = []
items = []
seen_ids = set()


def fail(msg):
    errors.append(msg)


def check(q, fname, idx):
    where = '%s[%d]' % (fname, idx)
    if not isinstance(q, dict):
        fail('%s: 不是对象' % where)
        return False
    for k in ('id', 'cat', 'level', 'type', 'q', 'options', 'answer'):
        if k not in q:
            fail('%s: 缺少字段 %s' % (where, k))
            return False
    qid = q['id']
    if not isinstance(qid, str) or not qid.strip():
        fail('%s: id 非法' % where)
        return False
    if qid in seen_ids:
        fail('%s: id 重复 %s' % (where, qid))
        return False
    seen_ids.add(qid)

    if q['cat'] != fname.replace('.json', ''):
        fail('%s: cat=%r 与文件名不一致' % (where, q['cat']))
    if q['level'] not in LEVELS:
        fail('%s: level=%r 非法' % (where, q['level']))
    if q['type'] not in TYPES:
        fail('%s: type=%r 非法' % (where, q['type']))
    if not isinstance(q['q'], str) or len(q['q'].strip()) < 4:
        fail('%s: 题干过短' % where)

    opts = q['options']
    if not isinstance(opts, list) or not all(isinstance(o, str) for o in opts):
        fail('%s: options 必须是字符串数组' % where)
        return False
    if q['type'] == 'judge':
        if opts != ['正确', '错误']:
            fail('%s: judge 的 options 必须为 ["正确","错误"]，实际 %r' % (where, opts))
    else:
        if not (2 <= len(opts) <= 6):
            fail('%s: 选项数量 %d 不合理' % (where, len(opts)))
    if len(set(opts)) != len(opts):
        fail('%s: 存在重复选项' % where)

    ans = q['answer']
    if not isinstance(ans, list) or not ans or not all(isinstance(a, int) for a in ans):
        fail('%s: answer 必须是整数数组' % where)
        return False
    if len(set(ans)) != len(ans):
        fail('%s: answer 有重复下标' % where)
    for a in ans:
        if a < 0 or a >= len(opts):
            fail('%s: answer 下标 %d 越界（选项 %d 个）' % (where, a, len(opts)))
    if q['type'] == 'single' and len(ans) != 1:
        fail('%s: single 必须恰好 1 个正确答案，实际 %d' % (where, len(ans)))
    if q['type'] == 'multi' and len(ans) < 2:
        fail('%s: multi 至少 2 个正确答案，实际 %d' % (where, len(ans)))
    if q['type'] == 'judge' and len(ans) != 1:
        fail('%s: judge 必须恰好 1 个正确答案' % where)

    if not q.get('explain') or len(str(q['explain']).strip()) < 10:
        fail('%s: explain 缺失或过短' % where)
    tags = q.get('tags')
    if not isinstance(tags, list) or not (1 <= len(tags) <= 6):
        fail('%s: tags 应为 1~6 个' % where)

    # 规范化
    q.setdefault('explain', '')
    q.setdefault('tags', [])
    if 'code' in q and not isinstance(q['code'], str):
        fail('%s: code 必须是字符串' % where)
        q.pop('code', None)
    return True


def main():
    if not os.path.isdir(DATA_DIR):
        print('找不到 data 目录：%s' % DATA_DIR)
        return 1

    files = [f + '.json' for f in ORDER if os.path.exists(os.path.join(DATA_DIR, f + '.json'))]
    for extra in sorted(os.listdir(DATA_DIR)):
        if extra.endswith('.json') and extra[:-5] not in ORDER:
            warnings.append('未在 ORDER 中的文件，已忽略：%s' % extra)

    for name in files:
        path = os.path.join(DATA_DIR, name)
        try:
            with open(path, 'r', encoding='utf-8-sig') as fh:
                arr = json.load(fh)
        except Exception as exc:  # noqa: BLE001
            fail('%s: JSON 解析失败 -> %s' % (name, exc))
            continue
        if not isinstance(arr, list):
            fail('%s: 顶层必须是数组' % name)
            continue
        for i, q in enumerate(arr):
            if check(q, name, i):
                items.append(q)

    if errors:
        print('✗ 校验失败，共 %d 处问题：' % len(errors))
        for e in errors[:60]:
            print('  - ' + e)
        if len(errors) > 60:
            print('  ... 还有 %d 处' % (len(errors) - 60))
        return 1

    payload = json.dumps(items, ensure_ascii=False, indent=1, separators=(',', ': '))
    banner = (
        '/* 自动生成，请勿直接修改！\n'
        '   源文件：data/*.json    生成脚本：scripts/build_bank.py */\n'
    )
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8', newline='\n') as fh:
        fh.write(banner)
        fh.write('window.UNITY_BANK = ')
        fh.write(payload)
        fh.write(';\n')

    # 统计
    stat = {}
    lv = {}
    tp = {}
    for q in items:
        stat[q['cat']] = stat.get(q['cat'], 0) + 1
        lv[q['level']] = lv.get(q['level'], 0) + 1
        tp[q['type']] = tp.get(q['type'], 0) + 1

    print('✓ 已生成 %s' % os.path.relpath(OUT, ROOT).replace('\\', '/'))
    print('  总题数：%d' % len(items))
    for k in files:
        cid = k[:-5]
        print('  %-8s %3d' % (cid, stat.get(cid, 0)))
    print('  难度：' + ' / '.join('%s %d' % (k, v) for k, v in sorted(lv.items())))
    print('  题型：' + ' / '.join('%s %d' % (k, v) for k, v in sorted(tp.items())))
    for w in warnings:
        print('  ! ' + w)
    return 0


if __name__ == '__main__':
    sys.exit(main())
