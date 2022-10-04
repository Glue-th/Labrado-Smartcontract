pragma solidity =0.5.16;

import "./interfaces/ILabradoFactory.sol";
import "./LabradoPair.sol";

contract LabradoFactory is ILabradoFactory {
    address public feeTo;
    mapping(address => mapping(address => address)) public getPair;
    address[] public allPairs;

    // custom add
    address admin;
    bool public openCreatePairs; // Allow anyone to create pairs. Default value = `false`

    event PairCreated(
        address indexed token0,
        address indexed token1,
        address pair,
        uint256
    );

    modifier onlyRoleAdmin() {
        require(msg.sender == admin, "LabradoFactory: FORBIDDEN");
        _;
    }

    constructor(address _feeTo) public {
        feeTo = _feeTo;
        admin = msg.sender; // custom add
    }

    function allPairsLength() external view returns (uint256) {
        return allPairs.length;
    }

    function createPair(address tokenA, address tokenB)
        external
        returns (address pair)
    {
        if (!openCreatePairs)
            require(msg.sender == admin, "LabradoFactory: FORBIDDEN"); // custom add

        require(tokenA != tokenB, "LabradoFactory: IDENTICAL_ADDRESSES");
        (address token0, address token1) = tokenA < tokenB
            ? (tokenA, tokenB)
            : (tokenB, tokenA);
        require(token0 != address(0), "LabradoFactory: ZERO_ADDRESS");
        require(
            getPair[token0][token1] == address(0),
            "LabradoFactory: PAIR_EXISTS"
        ); // single check is sufficient
        bytes memory bytecode = type(LabradoPair).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        ILabradoPair(pair).initialize(token0, token1);
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair; // populate mapping in the reverse direction
        allPairs.push(pair);
        emit PairCreated(token0, token1, pair, allPairs.length);
    }

    function setFeeTo(address _feeTo) external onlyRoleAdmin {
        feeTo = _feeTo;
    }

    // custom add
    function setNewAdmin(address _newAdmin) external onlyRoleAdmin {
        admin = _newAdmin;
    }

    // custom add
    function setOpenCreatePairs(bool _status) external onlyRoleAdmin {
        openCreatePairs = _status;
    }

    // custom add
    function setFeeSwapPair(
        address _token0,
        address _token1,
        uint256 _feeSwap
    ) external onlyRoleAdmin returns (bool) {
        address pair = getPair[_token0][_token1];
        require(pair != address(0), "LabradoFactory: PAIR_NOT_FOUND");
        bool result = ILabradoPair(pair).setupFeeSwap(_feeSwap);
        return result;
    }

    // custom add
    function setOpenSwapPair(
        address _token0,
        address _token1,
        bool _status
    ) external onlyRoleAdmin returns (bool) {
        address pair = getPair[_token0][_token1];
        require(pair != address(0), "LabradoFactory: PAIR_NOT_FOUND");
        bool result = ILabradoPair(pair).setupOpenSwap(_status);
        return result;
    }

    // custom add
    function setOpenAddLiquidity(
        address _token0,
        address _token1,
        bool _status
    ) external onlyRoleAdmin returns (bool) {
        address pair = getPair[_token0][_token1];
        require(pair != address(0), "LabradoFactory: PAIR_NOT_FOUND");
        bool result = ILabradoPair(pair).setupOpenAddLiquidity(_status);
        return result;
    }

    // custom add
    function setMultiSetRoutersPair(
        address _token0,
        address _token1,
        address[] calldata _routers,
        bool[] calldata _status
    ) external onlyRoleAdmin returns (bool) {
        address pair = getPair[_token0][_token1];
        require(pair != address(0), "LabradoFactory: PAIR_NOT_FOUND");
        bool result = ILabradoPair(pair).multiSetRouters(_routers, _status);
        return result;
    }
}
