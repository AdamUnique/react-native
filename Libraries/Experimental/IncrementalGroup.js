/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

'use strict';

const Incremental = require('./Incremental');
const React = require('react');

const PropTypes = require('prop-types');

const infoLog = require('../Utilities/infoLog');

let _groupCounter = -1;
const DEBUG = false;

import type {Props, Context} from './Incremental';

/**
 * WARNING: EXPERIMENTAL. Breaking changes will probably happen a lot and will
 * not be reliably announced.  The whole thing might be deleted, who knows? Use
 * at your own risk.
 *
 * `<Incremental>` components must be wrapped in an `<IncrementalGroup>` (e.g.
 * via `<IncrementalPresenter>`) in order to provide the incremental group
 * context, otherwise they will do nothing.
 *
 * See Incremental.js for more info.
 */
class IncrementalGroup extends React.Component<
  Props & {disabled?: boolean, ...},
> {
  context: Context;
  _groupInc: string;
  UNSAFE_componentWillMount() {
    this._groupInc = `g${++_groupCounter}-`;
    DEBUG && infoLog('create IncrementalGroup with id ' + this.getGroupId());
  }

  getGroupId(): string {
    const ctx = this.context.incrementalGroup;
    const prefix = ctx ? ctx.groupId + ':' : '';
    return prefix + this._groupInc + this.props.name;
  }

  getChildContext(): Context {
    if (this.props.disabled || this.context.incrementalGroupEnabled === false) {
      return {
        incrementalGroupEnabled: false,
        incrementalGroup: null,
      };
    }
    return {
      incrementalGroupEnabled: true,
      incrementalGroup: {
        groupId: this.getGroupId(),
        incrementalCount: -1,
      },
    };
  }

  render(): React.Node {
    return (
      <Incremental onDone={this.props.onDone} children={this.props.children} />
    );
  }
}
IncrementalGroup.contextTypes = {
  incrementalGroup: PropTypes.object,
  incrementalGroupEnabled: PropTypes.bool,
};
IncrementalGroup.childContextTypes = IncrementalGroup.contextTypes;

module.exports = IncrementalGroup;
